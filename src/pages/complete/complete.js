import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { promisify, isComplete } from '../../utils/util'
import request from '../../utils/request'
import wxUtil from '../../utils/wxUtil'
import { DEGREE_TYPE, GENDER_TYPE } from '../../macro'

Page({
  data: {
    isShowAuthModal: false,
    degreeSelect: DEGREE_TYPE,
    genderSelect: GENDER_TYPE,
    basic: {},
    education: {},
    work: {},
  },
  onLoad() {
    request.getUserInfo().then(userInfo => {
      this.setData({
        basic: {
          head_url: userInfo.avatarUrl,
          gender: R.findIndex(R.propEq('id', userInfo.gender))(GENDER_TYPE),
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
  handleSave() {
    let { basic, education, work } = this.data
    // 处理gender
    const gender = GENDER_TYPE[basic.gender] || {}
    basic = R.assoc('gender', gender.id || 0, basic)

    // 处理degree
    const degree = DEGREE_TYPE[education.background] || {}
    education = R.assoc('background', degree.name || 0, education)

    if (!basic.real_name || !basic.descr || !education.school || !work.company) {
      wxUtil.showToast('必填项未填完整')
      return
    }

    // 提交数据
    Promise.all([
      Api.getSaveBasic(basic),
      Api.getSaveEducation(education),
      Api.getSaveWork(work),
    ]).then(() => {
      wxUtil.showToast('保存成功', 'success').then(() => {
        wxUtil.navigateTo('mine', {}, 'all')
      })
    }, () => {
      wxUtil.showToast('请重试')
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
    if (!userInfo) {
      wxUtil.showToast('授权失败请重试')
      return
    }
    this.setData({ isShowAuthModal: false })
    // 判断是否信息完善
    isComplete().then(res => {
      if (res) {
        wxUtil.navigateTo('index', {}, true)
        return
      }
      this.setData({
        basic: {
          head_url: userInfo.avatarUrl,
          gender: R.findIndex(R.propEq('id', userInfo.gender))(GENDER_TYPE),
        },
      })
    })
  },
})
