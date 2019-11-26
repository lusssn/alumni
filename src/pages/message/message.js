import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const app = getApp()

Page({
  data: {
    messageList: [{
      "messageId": 96971,
      "type": 64932,
      "payload": "kHfgpav8ar",
      "status": 40180,
      "fromUser": 44947,
      "toUser": 38249,
      "fromUserName": "IE7yQI2MmF"
    }, {
      "messageId": 96972,
      "type": 64932,
      "payload": "kHfgpav8ar",
      "status": 40180,
      "fromUser": 44947,
      "toUser": 38249,
      "fromUserName": "IE7yQI2MmF"
    }],
    messagePagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      this.loadstartedList()
    })
  },
  onPullDownRefresh() {
    this.loadstartedList().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.startedPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadMessageList(current + 1)
    }
  },
  loadMessageList(pageNo = 1) {
    return Api.getMessages({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        startedList: pageNo === 1 ? list : this.data.startedList.concat(list),
        startedPagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => { })
  },
  // 点击消息列表，将未读更改为已读
  handleClickMessage(e) {
    const { id } = e.currentTarget.dataset;
    const clickedItem = this.data.messageList.find(item => item.messageId === id);
    if ( clickedItem.status === 0 ) {
      const { messageId, status, fromUserName } = clickedItem;
      readMessage({ messageId, status, fromUserName })
    }
  }
})
