import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import * as Util from '../../utils/util'
import { CONTACT_TYPE } from '../../macros'

const PAGE_SIZE = 10
const app = getApp()

Page({
  data: {
    friendList: null, // 初始化为null，方便页面加载动画展示
    friendPagination: { current: 1, total: 0 },
    noticeList: [],
    noticeTotal: 0,
    favoriteList: null, // 初始化为null，方便页面加载动画展示
    favoritePagination: { current: 1, total: 0 },
    currentTab: 'friend',
  },
  onLoad() {
    wxUtil.login().then(() => {
      // 加载消息列表数据
      this.loadNoticeList()
      // 加载朋友列表数据
      this.loadFriendList()
      // 加载收藏列表
      this.loadFavoriteList()
    })
  },
  onShow() {
    app.checkNotice('favorited', true, this.loadFavoriteList)
  },
  onPullDownRefresh() {
    Promise.all([
      this.loadNoticeList(),
      this.loadFriendList(),
      this.loadFavoriteList(),
    ]).then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { currentTab } = this.data
    if (currentTab === 'friend') {
      const { total, current } = this.data.friendPagination
      // 是否为最后一页
      if (Math.ceil(total / PAGE_SIZE) > current) {
        this.loadFriendList(current + 1)
      }
      return
    }
    const { total, current } = this.data.favoritePagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadFavoriteList(current + 1)
    }
  },
  loadNoticeList() {
    return Api.getNoticeList({
      pageIndex: 1,
      pageSize: 3,
    }).then(data => {
      const { list, count } = data
      list.forEach(item => {
        const contactType = R.find(R.propEq('id', +item.status))(CONTACT_TYPE) || {}
        item.status_name = contactType.name
        item.createTime = Util.getYearMonthDate(item.createTime)
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
  loadFavoriteList(pageNo = 1) {
    // 加载收藏列表数据
    return Api.getFavoriteList({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        favoriteList: pageNo === 1 ? list : this.data.favoriteList.concat(list),
        favoritePagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {})
  },
  handleSwitch(e) {
    const { id } = e.target.dataset
    if (!id) return
    this.setData({
      currentTab: id,
    })
  },
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('detail', { id })
  },
  handleToNotice() {
    wxUtil.navigateTo('notice')
  },
})
