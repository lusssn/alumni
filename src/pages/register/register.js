import { GENDER_TYPE } from '../../macros'
import * as R from '../../utils/ramda/index'
import request from '../../utils/request'
import wxUtil from '../../utils/wxUtil'
import { isComplete } from '../../utils/util'

Page({
  data: {
    isShowAuthModal: false,
    genderSelect: GENDER_TYPE,
    basic: {},
    redirect: '', // 完善后跳转的路径
    options: '', // 完善后跳转的路径参数
  },
  onLoad({ redirect = 'mine', options = '{}' }) {
    this.setData({ redirect, options })
    request.getUserInfo().then(this.initBasic, () => {
      // 未授权，显示授权弹窗
      this.setData({
        isShowAuthModal: true,
      })
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
    console.log('userInfo', userInfo)
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
      'basic.type': +value
    })
  },
  handleNext() {
    // TODO 注册接口
    const { redirect, options, basic } = this.data
    if (!basic.name.trim()) {
      wxUtil.showToast('请填写姓名')
      return
    }
    if (basic.type === -1) {
      wxUtil.showToast('请选择身份')
      return
    }
    console.log(basic)
    // wxUtil.navigateTo('complete', {
    //   redirect,
    //   options,
    //   isStudent: !basic.type,
    // }, true)
  },
  initBasic(userInfo) {
    console.log('openId', userInfo.openId)
    this.setData({
      basic: {
        name: '',
        openid: userInfo.openId,
        avatar: userInfo.avatarUrl,
        gender: R.findIndex(R.propEq('id', userInfo.gender), GENDER_TYPE),
        type: -1,
      },
    })
  }
})
