import * as R from '../../utils/ramda/index'
import { promisifyWxApi } from '../../utils/util'
import request from '../../utils/request'
import wxUtil from '../../utils/wxUtil'

Page({
  data: {
    isShowAuthModal: false,
    degreeSelect: [
      { id: 5, name: '专科' },
      { id: 4, name: '本科' },
      { id: 3, name: '硕士' },
      { id: 2, name: '博士' },
      { id: 1, name: '其他' },
    ],
    genderSelect: [
      { id: 1, name: '男' },
      { id: 2, name: '女' },
    ],
    basic: {},
    education: {},
    work: {},
  },
  onLoad() {
    request.getUserInfo().then(userInfo => {
      const { genderSelect } = this.data
      this.setData({
        basic: {
          head_url: userInfo.avatarUrl,
          gender: R.findIndex(R.propEq('id', userInfo.gender))(genderSelect),
        },
      })
    }, () => {
      // 未授权，显示授权弹窗
      this.setData({
        isShowAuthModal: true,
      })
    })
  },
  handleClickAvatar() {
    promisifyWxApi(wx.chooseImage)({
      count: 1,
    }).then(res => {
      this.setData({
        'basic.head_url': res.tempFilePaths.pop(),
      })
    })
  },
  handleInputChange(e) {
    const { name } = e.currentTarget.dataset
    this.setData({
      [name]: e.detail.value,
    })
  },
  handleSave() {
    console.log(this.data)
    let { basic, education, work, degreeSelect, genderSelect } = this.data
    // 处理gender
    const gender = genderSelect[basic.gender] || {}
    basic = R.assoc('gender', gender.id || 0, basic)

    // 处理degree
    const degree = degreeSelect[education.degree] || {}
    education = R.assoc('degree', degree.id || 0)
    // TODO 提交数据
    request.getUserInfo().then(userInfo => {
      request.post('/edit/editbase', {
        openid: userInfo.openId,
        ...basic,
      }).then(() => {

      }, () => {})
      request.post('/edit/addeducation', {
        openid: userInfo.openId,
        ...education,
      }).then(() => {

      }, () => {})
      request.post('/edit/addwork', {
        openid: userInfo.openId,
        ...work,
      }).then(() => {

      }, () => {})
    })
  },
  handleCloseAuthModal() {
    // 关闭弹窗
    this.setData({
      isShowAuthModal: false,
    })
  },
  handleAuth(e) {
    const { event } = e.detail
    const { userInfo } = event.detail
    const { genderSelect } = this.data
    this.setData({
      basic: {
        head_url: userInfo.avatarUrl,
        gender: R.findIndex(R.propEq('id', userInfo.gender))(genderSelect),
      },
      isShowAuthModal: false,
    })
  }
})
