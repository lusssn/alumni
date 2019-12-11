import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

const app = getApp()

const PAGE_SIZE = 10

Page({
  data: {
    noticeList: null,
    noticePagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      this.loadNoticeList()
    })
  },
  onPullDownRefresh() {
    this.loadNoticeList().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.noticePagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadNoticeList(current + 1)
    }
  },
  loadNoticeList(pageNo = 1) {
    return Api.getNoticeList({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        noticeList: pageNo === 1 ? list : this.data.noticeList.concat(list),
        noticePagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => { })
  },
  // 点击消息列表，将未读更改为已读
  handleClickNotice(e) {
    const { id } = e.currentTarget.dataset;
    Api.readNotice({ messageId: id, status: 1 }).then(res => {
      const readedIndex = this.data.noticeList.findIndex(item => item.messageId === id)
      let tempList = R.clone(this.data.noticeList)
      tempList.splice(readedIndex, 1)
      this.setData({
        noticeList: tempList
      })
    }).catch(() => {
      wx.showToast({
        title: "阅读消息失败，请稍后重试",
        icon: "none"
      })
    })
    setTimeout(() => {
      wx.hideToast()
    }, 1500)
  }
})
