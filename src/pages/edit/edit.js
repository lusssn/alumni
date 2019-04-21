import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { promisify } from '../../utils/util'
import request from '../../utils/request'
import wxUtil from '../../utils/wxUtil'
import {
  GENDER_TYPE, DEGREE_TYPE,
  BASIC_FIELD, EDUCATION_FIELD, WORK_FIELD,
} from '../../macro'

const EDIT_TYPE = [
  { type: 'basic', title: '编辑基本信息' },
  { type: 'education', title: '添加教育经历' },
  { type: 'work', title: '添加工作经历' },
]

Page({
  data: {
    type: '', // 当前编辑的信息类型
    id: null, // 若不为null，表示为编辑状态
    degreeSelect: DEGREE_TYPE,
    genderSelect: GENDER_TYPE,
    basic: {},
    education: {
      background: R.findIndex(R.propEq('name', '本科'))(DEGREE_TYPE),
    },
    work: {},
  },
  onLoad({ type, id = null }) {
    // 动态设置页面标题
    const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
    wx.setNavigationBarTitle({
      title: editType.title,
    })
    // 判断修改类型，加载对应数据
    if (type === 'basic') {
      this.loadBasic()
    } else if (type === 'education' && id) {
      this.loadEducation(id)
    } else if (type === 'work' && id) {
      this.loadWork(id)
    }
    this.setData({ type, id })
  },
  // 点击头像
  handleClickAvatar() {
    promisify(wx.chooseImage)({
      count: 1,
    }).then(res => {
      this.setData({
        'basic.head_url': res.tempFilePaths.pop(),
      })
    })
  },
  // 定位
  handleLocation() {
    request.getLocation().then(res => {
      this.setData({ 'basic.city': res })
    }, err => wxUtil.showToast(err.errMsg))
  },
  handleInputChange(e) {
    const { name } = e.currentTarget.dataset
    this.setData({
      [name]: e.detail.value,
    })
  },
  handleRemove() {
    promisify(wx.showModal)({
      title: '提示',
      content: '你确认要删除该条信息吗？',
      confirmColor: '#2180E8',
    }).then(({ confirm }) => {
      if (!confirm) {
        return
      }
      // 删除请求
      const { type, id } = this.data
      let next = null
      if (type === 'education') {
        next = Api.removeEducation({ num: id })
      } else if (type === 'work') {
        next = Api.removeWork({ num: id })
      }
      next.then(() => {
        const app = getApp()
        type === 'education' && app.setNotice('editedEducation', true)
        type === 'work' && app.setNotice('editedWork', true)
        wxUtil.showToast('删除成功', 'success').then(() => {
          wx.navigateBack()
        })
      }, () => {
        wxUtil.showToast('删除失败')
      })
    })
  },
  handleSave() {
    const { type } = this.data
    let params = R.clone(this.data[type])
    let next = null
    if (type === 'basic') {
      // 处理gender
      const gender = GENDER_TYPE[params.gender] || {}
      params.gender = gender.id
      // 必填项
      params = this.checkParams(BASIC_FIELD, params)
      if (!params) return
      next = Api.saveBasic(params)

    } else if (type === 'education') {
      // 处理degree
      const degree = DEGREE_TYPE[params.background] || {}
      params.background = degree.name
      // 必填项
      params = this.checkParams(EDUCATION_FIELD, params)
      if (!params) return
      next = Api.saveEducation(params)

    } else if (type === 'work') {
      // 必填项
      params = this.checkParams(WORK_FIELD, params)
      if (!params) return
      next = Api.saveWork(params)
    }
    // 发起请求
    next.then(() => {
      const app = getApp()
      type === 'basic' && app.setNotice('editedBasic', true)
      type === 'education' && app.setNotice('editedEducation', true)
      type === 'work' && app.setNotice('editedWork', true)
      wxUtil.showToast('保存成功', 'success').then(() => {
        wx.navigateBack()
      })
    }, () => {
      wxUtil.showToast('保存失败')
    })
  },
  checkParams(checkList, params) {
    const _params = R.clone(params)
    for (let field of checkList) {
      if (field.isMust && !_params[field.prop]) {
        wxUtil.showToast(`${field.name}必填`)
        return false
      }
      if (!_params[field.prop]) {
        _params[field.prop] = field.defaultValue
      }
    }
    return _params
  },
  loadBasic() {
    Api.getBasicInfo().then(data => {
      const { base, personal } = data
      const basic = { ...base[0], ...personal[0] }
      // 处理性别
      basic.gender = R.findIndex(
        R.propEq('id', Number(basic.gender)),
      )(GENDER_TYPE)
      this.setData({ basic })
    }, () => {})
  },
  loadEducation(id) {
    Api.getEducationInfo().then(data => {
      // 找到id对应项
      const education = R.find(R.propEq('num', id))(data) || {}
      // 处理学历
      education.background = R.findIndex(
        R.propEq('name', education.background),
      )(DEGREE_TYPE)
      this.setData({ education })
    }, () => {})
  },
  loadWork(id) {
    Api.getWorkInfo().then(data => {
      // 找到id对应项
      const work = R.find(R.propEq('num', id))(data) || {}
      this.setData({ work })
    }, () => {})
  },
})
