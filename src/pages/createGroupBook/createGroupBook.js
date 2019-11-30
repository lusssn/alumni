import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const app = getApp()

Page({
  data: {
    groupName: '', // 群名称
    groupIntro: '', // 群简介
  },
  handleGroupNameChange(e) {
    this.setData({
      groupName: e.detail.value
    })
  }, 
  handleGroupIntroChange() {
    this.setData({
      groupIntro: e.detail.value
    })
  },
  // 点击消息列表，将未读更改为已读
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
    }
    // 发起请求
  }
})
