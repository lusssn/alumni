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

const NAV_CONFIG = [
  { id: 1, name: '未读消息', key: 'New' },
  { id: 2, name: '历史消息', key: 'History' },
]

Page({
  data: {
    NAV: NAV_CONFIG,
    currentTab: NAV_CONFIG[0],
    newNoticeList: null,
    newPagination: { current: 1, total: 0 },
    historyNoticeList: null,
    historyPagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      this.loadNewNotices()
      this.loadHistoryNotices()
    })
  },
  onPullDownRefresh() {
    this.loadNewNotices().then(() => {
      wx.stopPullDownRefresh()
    })
    Promise.all([
      this.loadNewNotices(),
      this.loadHistoryNotices(),
    ]).then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { currentTab } = this.data
    if (currentTab.key === 'New') {
      const { total, current } = this.data.newPagination
      // 是否为最后一页
      if (Math.ceil(total / PAGE_SIZE) > current) {
        this.loadNewNotices(current + 1)
      }
      return
    }
    const { total, current } = this.data.historyPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadHistoryNotices(current + 1)
    }
  },
  loadNewNotices(pageNo = 1) {
    return Api.getNoticeList({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
      status: 0,
    }).then(data => {
      const { list, count } = data
      const resultList = list.map(item => {
        return R.assoc('type', NOTICE_TYPE_MAP[item.type], item)
      })
      this.setData({
        newNoticeList: pageNo === 1 ? resultList : this.data.newNoticeList.concat(resultList),
        newPagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => { })
  },
  loadHistoryNotices(pageNo = 1) {
    return Api.getNoticeList({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
      status: 1,
    }).then(data => {
      const { list, count } = data
      const resultList = list.map(item => {
        return R.assoc('type', NOTICE_TYPE_MAP[item.type], item)
      })
      this.setData({
        historyNoticeList: pageNo === 1 ? resultList : this.data.historyNoticeList.concat(resultList),
        historyPagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => { })
  },
  handleSwitch(event) {
    const { id } = event.detail
    this.setData({
      currentTab: R.find(R.propEq('id', id), NAV_CONFIG),
    })
  },
  // 点击消息列表
  handleClickNotice(e) {
    const { id, noticetype } = e.currentTarget.dataset
    const { newNoticeList, historyNoticeList } = this.data
    if (noticetype === 'new') {
      const index = R.findIndex(R.propEq('messageId', id), newNoticeList)
      const { title, content, img, type, fromUser } = newNoticeList[index]
      if (type.key === 'Activity') {
        wxUtil.navigateTo('activityInfo', {
          activityId: fromUser,
          title,
          content,
          img,
        })
      } else {
        wxUtil.navigateTo('detail', { id: fromUser })
      }
      // 将未读更改为已读
      Api.readNotice({
        messageId: id,
        status: 1,
      }).then(() => {
        this.setData({
          newNoticeList: R.remove(index, 1, newNoticeList),
        })
      }, err => {
        wxUtil.showToast(err.errMsg, 'none')
      })
    } else {
      const index = R.findIndex(R.propEq('messageId', id), historyNoticeList)
      const { title, content, img, type, fromUser } = historyNoticeList[index]
      if (type.key === 'Activity') {
        wxUtil.navigateTo('activityInfo', {
          activityId: fromUser,
          title,
          content,
          img,
        })
      } else {
        wxUtil.navigateTo('detail', { id: fromUser })
      }
    }
  },
})
