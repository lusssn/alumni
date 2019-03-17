import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  data: {
    isLoaded: false,
    friendList: [],
    noticeList: [],
  },
  onLoad() {
    request.getUserInfo().then(({ openId }) => {
      // 加载消息列表数据
      request.get(`/friend/getinform/${openId}`).then(({ data }) => {
        this.setData({
          isLoaded: true,
          noticeList: data,
        })
      }, () => {})
      // 加载朋友列表数据
      request.get(`/friend/getfriend/${openId}`).then(({ data }) => {
        this.setData({
          isLoaded: true,
          // 避免wxml中做friendList.length时抛异常
          friendList: data || [],
        })
      }, () => {})
    }, () => {})
  },
  handleClickCard() {
    wxUtil.navigateTo('detail')
  },
  handleToNotice() {
    wxUtil.navigateTo('notice')
  },
})
