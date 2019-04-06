import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { CONTACT_TYPE } from '../../macro'

const PAGE_SIZE = 10

Page({
  data: {
    friendList: null, // 初始化为null，方便页面加载动画展示
    friendPagination: { current: 1, total: 0 },
    noticeList: [],
    noticeTotal: 0,
  },
  onLoad() {
    // 加载消息列表数据
    Api.fetchNoticeList({
      page: 1,
      limit: 3,
    }).then(data => {
      const { result, count } = data
      result.forEach(item => {
        const contactType = R.find(R.propEq('id', +item.state))(CONTACT_TYPE) || {}
        item.status_name = contactType.name
      })
      this.setData({
        noticeList: result,
        noticeTotal: count,
      })
    }, () => {})
    // 加载朋友列表数据
    this.loadFriendList()
  },
  onReachBottom() {
    const { total, current } = this.data.friendPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadFriendList(current + 1)
    }
  },
  loadFriendList(pageNo = 1) {
    // 加载朋友列表数据
    return Api.fetchFriendList({
      page: pageNo,
      limit: PAGE_SIZE,
    }).then(data => {
      const { result, count } = data
      this.setData({
        friendList: pageNo === 1 ? result : this.data.friendList.concat(result),
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
