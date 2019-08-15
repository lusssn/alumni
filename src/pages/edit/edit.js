import moment from '../../utils/moment.min'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { checkParams, promisify } from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import {
  BASIC_FIELD,
  DEGREE_TYPE,
  EDUCATION_FIELD,
  GENDER_TYPE,
  WORK_FIELD,
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
  onLoad ({ type, id = null }) {
    // 动态设置页面标题
    const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
    wx.setNavigationBarTitle({
      title: editType.title,
    })
    // 判断修改类型，加载对应数据
    wxUtil.login().then(() => {
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
  handleClickAvatar () {
    promisify(wx.chooseImage)({
      count: 1,
    }).then(res => {
      this.setData({
        'account.avatar': res.tempFilePaths.pop(),
      })
    })
  },
  // 定位
  handleLocation () {
    wxUtil.getLocation().then(res => {
      this.setData({ 'account.city': res })
    }, err => wxUtil.showToast(err.errMsg))
  },
  handleInputChange (e) {
    const { name } = e.currentTarget.dataset
    // if (name === 'account.gender') {
    //   // 性别取值问题
    //   this.setData({
    //     [name]: GENDER_TYPE[e.detail.value].id,
    //     // [name]: e.detail.value,
    //   })
    // }
    this.setData({
      // [name]: GENDER_TYPE[e.detail.value].id,
      [name]: e.detail.value,
    })
  },
  handleRemove () {
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
        next = Api.removeEducation({ educationId: id })
      } else if (type === 'job') {
        next = Api.removeWork({ jobId: id })
      }
      next && next.then(() => {
        app.setNotice('edited', true)
        wxUtil.showToast('删除成功', 'success').then(() => {
          wx.navigateBack()
        })
      }, () => {
        wxUtil.showToast('删除失败')
      })
    })
  },
  handleSave () {
    const { type } = this.data
    let params = R.clone(this.data[type])
    let next = null
    if (type === 'account') {
      // 必填项
      params = checkParams(BASIC_FIELD, params)
      if (R.isEmpty(params)) return
      next = Api.saveBasic(params)
    } else if (type === 'education') {
      // 处理degree
      const degree = DEGREE_TYPE[params.education] || {}
      params.education = degree.name
      // 必填项
      params = checkParams(EDUCATION_FIELD, params)
      if (R.isEmpty(params)) return
      params.accountId = app.global.accountId
      next = Api.saveEducation(params)
    } else if (type === 'job') {
      // 必填项
      params = checkParams(WORK_FIELD, params)
      if (!params) return
      params.accountId = app.global.accountId
      next = Api.saveWork(params)
    }
    // 发起请求
    next && next.then(() => {
      app.setNotice('edited', true)
      wxUtil.showToast('保存成功', 'success').then(() => {
        wx.navigateBack()
      })
    }, () => {
      wxUtil.showToast('保存失败')
    })
  },
  loadBasic () {
    const { accountId } = app.global
    Api.getAccount({ accountId }).then(data => {
      // 处理时间
      if (data.birthday) {
        data.birthday = moment(data.birthday).format('YYYY-MM-DD')
      }
      data.gender = Number(data.gender)
      this.setData({
        account: data,
      })
    }, () => {})
  },
  loadEducation (id) {
    const { accountId } = app.global
    Api.getEducationInfo({
      accountId,
      educationId: id,
    }).then(data => {
      // 处理时间
      if (data.startTime) {
        data.startTime = moment(data.startTime).format('YYYY')
      }
      if (data.endTime) {
        data.endTime = moment(data.endTime).format('YYYY')
      }
      // 处理学历
      data.education = R.findIndex(
        R.propEq('name', data.education),
      )(DEGREE_TYPE)
      this.setData({
        education: data,
      })
    }, () => {})
  },
  loadWork (id) {
    const { accountId } = app.global
    Api.getWorkInfo({
      accountId,
      jobId: id,
    }).then(data => {
      // 处理时间
      data.startTime = data.startTime
        ? moment(data.startTime).format('YYYY')
        : ''
      data.endTime = data.endTime ? moment(data.endTime).format('YYYY') : ''
      this.setData({ job: data })
    }, () => {})
  },
})
