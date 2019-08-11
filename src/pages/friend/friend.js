import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { CONTACT_TYPE } from '../../macros'
import moment from '../../utils/moment.min'

const PAGE_SIZE = 10
const app = getApp()
Page({
  data: {
    friendList: null, // 初始化为null，方便页面加载动画展示
    friendPagination: { current: 1, total: 0 },
    noticeList: [],
    noticeTotal: 0,
  },
  onLoad() {
    wxUtil.login().then(() => {
      // 加载消息列表数据
      this.loadNoticeList()
      // 加载朋友列表数据
      this.loadFriendList()
    })
  },
  onPullDownRefresh() {
    this.loadFriendList()
    this.loadNoticeList().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.friendPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadFriendList(current + 1)
    }
  },
  loadNoticeList() {
    return Api.getNoticeList({
      accountId: app.global.accountId,
      pageIndex: 1,
      pageSize: 3,
    }).then(data => {
      const { list, count } = data
      list.forEach(item => {
        const contactType = R.find(R.propEq('id', +item.status))(CONTACT_TYPE) || {}
        item.status_name = contactType.name
        item.createTime = moment(item.createTime).format('YYYY-MM-DD')
      })
      this.setData({
        noticeList: list,
        noticeTotal: count,
      })
    }, err => {
      wxUtil.showToast(err.errMsg)
    })
  },
  loadFriendList(pageNo = 1) {
    // 加载朋友列表数据
    return Api.getFriendList({
      accountId: app.global.accountId,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        friendList: pageNo === 1 ? list : this.data.friendList.concat(list),
        friendPagination: {
          current: pageNo,
          total: count,
        },
      })
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
