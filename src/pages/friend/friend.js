import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  data: {
    isLoaded: false,
    friendList: [],
  },
  onLoad() {
    request.getUserInfo().then(({ openId }) => {
      request.get(`/friend/getfriend/${openId}`).then(res => {
        this.setData({
          isLoaded: true,
          friendList: res.friend || [],
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
