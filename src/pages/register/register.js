import { GENDER_TYPE } from '../../macros'
import * as R from '../../utils/ramda/index'
import _request from '../../utils/_request'
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import { isComplete, promisify } from '../../utils/util'

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
    _request.getUserInfo().then(this.initBasic, () => {
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
    const { redirect, options, basic } = this.data
    if (!basic.name.trim()) {
      wxUtil.showToast('请填写姓名')
      return
    }
    if (basic.type === -1) {
      wxUtil.showToast('请选择身份')
      return
    }
    promisify(wx.login)().then(({ code }) => {
      if (code) {
        _request.get('/v2/wechat/code2Session', {
          js_code: code,
        }).then(
          res => {
            Api.createAccount({
              ...basic,
              accountId: res.data,
            }).then(
              () => {
                console.log(11)
                wxUtil.navigateTo('complete', {
                  redirect,
                  options,
                  isStudent: !basic.type,
                }, true)
              },
              () => {
                console.log(22)
              },
            )
          },
          () => {},
        )
      } else {
        console.log('in login has no code')
      }
    })
  },
  initBasic(userInfo) {
    this.setData({
      basic: {
        name: '',
        avatar: userInfo.avatarUrl,
        gender: R.findIndex(R.propEq('id', userInfo.gender), GENDER_TYPE),
        type: -1,
      },
    })
  }
})
