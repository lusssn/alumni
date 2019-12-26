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
      this.setData({
        noticeList: pageNo === 1 ? resultList : this.data.noticeList.concat(resultList),
        noticePagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => { })
  },
  // 点击消息列表
  handleClickNotice(e) {
    const { id } = e.currentTarget.dataset
    const { noticeList } = this.data
    const index = R.findIndex(R.propEq('messageId', id), noticeList)
    const { title, content, type, fromUser } = noticeList[index]
    if (type.key === 'Activity') {
      wxUtil.navigateTo('activityInfo', {
        activityId: fromUser,
        title,
        content,
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
        noticeList: R.remove(index, 1, noticeList),
      })
    }, err => {
      wxUtil.showToast(err.errMsg, 'none')
    })
  },
})
