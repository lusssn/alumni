import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

const PAGE_SIZE = 10
const NOTICE_TYPE = [
  { id: 0, name: '交换名片申请', key: 'Request' },
  { id: 1, name: '同意交换名片', key: 'Accepted' },
  { id: 2, name: '拒绝交换名片', key: 'Rejected' },
  { id: 10, name: '活动通知', key: 'Activity' },
]
const NOTICE_TYPE_MAP = (() => {
  return NOTICE_TYPE.reduce((result, current) => {
    result[current.id] = current
    return result
  }, {})
})()

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
      const resultList = list.map(item => {
        return R.assoc('type', NOTICE_TYPE_MAP[item.type], item)
      })
      console.log(resultList)
      this.setData({
        noticeList: pageNo === 1 ? resultList : this.data.noticeList.concat(resultList),
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
