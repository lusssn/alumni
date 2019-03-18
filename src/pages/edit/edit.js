import * as R from '../../utils/ramda/index'
import { promisifyWxApi } from '../../utils/util'
import request from '../../utils/request'
import wxUtil from '../../utils/wxUtil'
import { GENDER_TYPE, DEGREE_TYPE } from '../../macro'

const EDIT_TYPE = [
  { type: 'basic', title: '编辑基本信息', saveUrl: '/edit/editbase' },
  {
    type: 'education',
    title: '添加教育经历',
    saveUrl: '/edit/addeducation',
    removeUrl: '/edit/deleteeducation',
  },
  {
    type: 'work',
    title: '添加工作经历',
    saveUrl: '/edit/addwork',
    removeUrl: '/edit/deletework',
  },
]

Page({
  data: {
    type: '', // 当前编辑的信息类型
    id: null, // 若不为null，表示为编辑状态
    degreeSelect: DEGREE_TYPE,
    genderSelect: GENDER_TYPE,
    basic: {},
    education: {},
    work: {},
  },
  onLoad({ type, id = null }) {
    // 动态设置页面标题
    const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
    wx.setNavigationBarTitle({
      title: editType.title,
    })
    this.initPageData(type, id)
    this.setData({ type, id })
  },
  // 页面数据初始化
  initPageData(type, id) {
    request.getUserInfo().then(({ openId }) => {
      // 判断修改类型，加载对应数据
      if (type === 'basic') {
        request.get(`/query/getbase/${openId}`).then(({ data }) => {
          const { base, personal } = data
          const basic = { ...base[0], ...personal[0] }
          // 处理性别
          basic.gender = R.findIndex(
            R.propEq('id', Number(basic.gender)),
          )(GENDER_TYPE)
          this.setData({ basic })
        }, () => {})
      } else if (type === 'education' && id) {
        request.get(`/query/geteducation/${openId}`).then(({ data }) => {
          // 找到id对应项
          const education = R.find(R.propEq('num', id))(data) || {}
          // 处理学历
          education.background = R.findIndex(
            R.propEq('name', education.background),
          )(DEGREE_TYPE)
          this.setData({ education })
        }, () => {})
      } else if (type === 'work' && id) {
        request.get(`/query/getwork/${openId}`).then(({ data }) => {
          // 找到id对应项
          const work = R.find(R.propEq('num', id))(data) || {}
          this.setData({ work })
        }, () => {})
      }
    }, () => {})
  },
  // 点击头像
  handleClickAvatar() {
    promisifyWxApi(wx.chooseImage)({
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
    })
  },
  handleInputChange(e) {
    const { name } = e.currentTarget.dataset
    this.setData({
      [name]: e.detail.value,
    })
  },
  handleRemove() {
    promisifyWxApi(wx.showModal)({
      title: '提示',
      content: '你确认要删除该条信息吗？',
      confirmColor: '#2180E8',
    }).then(({ confirm }) => {
      // 删除请求
      if (confirm) {
        const { type, id } = this.data
        const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
        request.getUserInfo().then(({ openId }) => {
          request.post(editType.removeUrl, {
            openid: openId,
            num: id,
          }).then(() => {
            wxUtil.showToast('删除成功', 'success').then(() => {
              wx.navigateBack()
            })
          }, () => {
            wxUtil.showToast('删除失败')
          })
        }, () => {})
      }
    })
  },
  handleSave() {
    const { type } = this.data
    const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
    request.getUserInfo().then(({ openId }) => {
      const params = {
        openid: openId,
        ...this.data[type],
      }
      if (type === 'basic') {
        // 处理gender
        const gender = GENDER_TYPE[params.gender] || {}
        params.gender = gender.id
      } else if (type === 'education') {
        // 处理degree
        const degree = DEGREE_TYPE[params.background] || {}
        params.background = degree.id
      }
      // 发起请求
      request.post(editType.saveUrl, params).then(() => {
        wxUtil.showToast('保存成功', 'success')
      }, () => {
        wxUtil.showToast('保存失败')
      })
    }, () => {})
  },
})
