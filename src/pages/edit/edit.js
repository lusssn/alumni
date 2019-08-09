import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { promisify } from '../../utils/util'
import _request from '../../utils/_request'
import wxUtil from '../../utils/wxUtil'
import {
  GENDER_TYPE, DEGREE_TYPE,
  BASIC_FIELD, EDUCATION_FIELD, WORK_FIELD,
} from '../../macros'

const EDIT_TYPE = [
  { type: 'account', title: '编辑基本信息' },
  { type: 'education', title: '添加教育经历' },
  { type: 'job', title: '添加工作经历' },
]

const app = getApp()

Page({
  data: {
    type: '', // 当前编辑的信息类型
    id: null, // 若不为null，表示为编辑状态
    degreeSelect: DEGREE_TYPE,
    genderSelect: GENDER_TYPE,
    account: {},
    education: {
      education: R.findIndex(R.propEq('name', '本科'))(DEGREE_TYPE),
    },
    job: {},
  },
  onLoad({ type, id = null }) {
    // 动态设置页面标题
    const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
    wx.setNavigationBarTitle({
      title: editType.title,
    })
    // 判断修改类型，加载对应数据
    _request.login().then(() => {
      if (type === 'account') {
        this.loadBasic()
      } else if (type === 'education' && id) {
        this.loadEducation(id)
      } else if (type === 'job' && id) {
        this.loadWork(id)
      }
    })
    this.setData({ type, id })
  },
  // 点击头像
  handleClickAvatar() {
    promisify(wx.chooseImage)({
      count: 1,
    }).then(res => {
      this.setData({
        'account.avatar': res.tempFilePaths.pop(),
      })
    })
  },
  // 定位
  handleLocation() {
    _request.getLocation().then(res => {
      this.setData({ 'account.city': res })
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
      } else if (type === 'job') {
        next = Api.removeWork({ num: id })
      }
      next.then(() => {
        const app = getApp()
        type === 'education' && app.setNotice('editedEducation', true)
        type === 'job' && app.setNotice('editedWork', true)
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
    if (type === 'account') {
      // 必填项
      params = this.checkParams(BASIC_FIELD, params)
      if (R.isEmpty(params)) return
      next = Api.saveBasic(params)
    } else if (type === 'education') {
      // 处理degree
      const degree = DEGREE_TYPE[params.education] || {}
      params.education = degree.name
      // 必填项
      params = this.checkParams(EDUCATION_FIELD, params)
      if (R.isEmpty(params)) return
      params.accountId = app.global.accountId
      next = Api.saveEducation(params)
    } else if (type === 'job') {
      // 必填项
      params = this.checkParams(WORK_FIELD, params)
      if (!params) return
      params.accountId = app.global.accountId
      next = Api.saveWork(params)
    }
    // 发起请求
    next && next.then(() => {
      const app = getApp()
      type === 'account' && app.setNotice('editedBasic', true)
      type === 'education' && app.setNotice('editedEducation', true)
      type === 'job' && app.setNotice('editedWork', true)
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
        return {}
      }
      if (!_params[field.prop]) {
        _params[field.prop] = field.defaultValue
      }
    }
    return _params
  },
  loadBasic() {
    const { accountId } = app.global
    Api.getAccount({ accountId }).then(data => {
      this.setData({
        account: R.assoc('gender', Number(data.gender), data),
      })
    }, () => {})
  },
  loadEducation(id) {
    const { accountId } = app.global
    Api.getEducationInfo({
      accountId,
      educationId: id,
    }).then(data => {
      // 处理学历
      const index = R.findIndex(
        R.propEq('name', data.education),
      )(DEGREE_TYPE)
      this.setData({
        education: R.assoc('education', index, data),
      })
    }, () => {})
  },
  loadWork(id) {
    const { accountId } = app.global
    Api.getWorkInfo({ accountId }).then(data => {
      // 找到id对应项
      const job = R.find(R.propEq('num', id))(data) || {}
      this.setData({ job })
    }, () => {})
  },
})
