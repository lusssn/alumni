import { GENDER_TYPE } from '../../macros'
import * as R from '../../utils/ramda/index'
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const app = getApp()

Page({
  data: {
    isShowAuthModal: false,
    genderSelect: GENDER_TYPE,
    basic: {},
    redirect: '', // 完善后跳转的路径
    options: '', // 完善后跳转的路径参数
  },
  onLoad({ redirect = 'mine', options = '{}' }) {
    this.setData({ redirect, options: decodeURIComponent(options) })
    wxUtil.getUserInfo().then(this.initBasic, () => {
      // 未授权，显示授权弹窗
      this.setData({
        isShowAuthModal: true,
      })
    })
  },
  handleCloseAuthModal() {
    this.initBasic()
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
    this.initBasic(userInfo)
    this.setData({ isShowAuthModal: false })
  },
  handleInputChange(event) {
    const { name } = event.target.dataset
    this.setData({
      [name]: event.detail.value,
    })
  },
  handleRoleChange(event) {
    const { value } = event.detail
    this.setData({
      'basic.type': +value,
    })
  },
  handleSkip() {
    const { redirect, options } = this.data
    wxUtil.navigateTo(redirect, JSON.parse(options), true)
  },
  handleNext() {
    const { redirect, options, basic } = this.data
    if (!basic.name.trim()) {
      wxUtil.showToast('请填写姓名')
      return
    }
    if (basic.type === -1) {
      wxUtil.showToast('请选择身份')
      return
    }
    Api.createAccount({
      ...R.assoc('gender', GENDER_TYPE[basic.gender].id, basic),
      accountId: app.global.accountId,
    }).then(
      () => {
        wxUtil.navigateTo('complete', {
          redirect,
          options,
          isStudent: basic.type === 0 ? 1 : 0,
        }, true)
      },
      () => {},
    )
  },
  initBasic(userInfo = {}) {
    this.setData({
      basic: {
        name: '',
        avatar: userInfo.avatarUrl,
        gender: R.findIndex(R.propEq('id', userInfo.gender || GENDER_TYPE[0].id), GENDER_TYPE),
        type: -1,
      },
    })
  },
})
