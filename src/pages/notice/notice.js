import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

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
    return Api.getMessage({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
      status: 0,
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
    const clickedItem = this.data.noticeList.find(item => item.noticeId === id);
    if ( clickedItem.status === 0 ) {
      const { noticeId, status, fromUserName } = clickedItem;
      readNotice({ noticeId, status, fromUserName })
    }
  }
})
