import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  data: {
    friendList: null,
    noticeList: [],
  },
  onLoad() {
    request.getUserInfo().then(({ openId }) => {
      // 加载消息列表数据
      request.get(`/friend/getinform/${openId}`).then(({ data }) => {
        this.setData({
          noticeList: data,
        })
      }, () => {})
      // 加载朋友列表数据
      request.get(`/friend/getfriend/${openId}`).then(({ data }) => {
        this.setData({
          friendList: data || [],
        })
      }, () => {})
    }, () => {})
  },
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('detail', { id })
  },
  handleToNotice() {
    wxUtil.navigateTo('notice')
  },
})
