import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const app = getApp()

Page({
  data: {
    groupName: '', // 群名称
    groupIntro: '', // 群简介
    showModal: false,
  },
  handleGroupNameChange(e) {
    console.log(e.detail.value)
    this.setData({
      groupName: e.detail.value
    })
  },
  handleGroupIntroChange(e) {
    this.setData({
      groupIntro: e.detail.value
    })
  },
  handleConfirm() {
    this.setData({ showModal: false })
  },
  handleComplete() {
    // 数据校验
    if (this.data.groupName.length == 0 || this.data.groupIntro.length == 0) {
      wx.showToast({
        title: '请检查是否输入完整数据',
        icon: 'cancel'
      })
      setTimeout(() => {
        wx.hideToast()
      }, 1000);
      return false;
    }
    // 发起请求
    // then showModal
    this.setData({ showModal: true })
  }
})
