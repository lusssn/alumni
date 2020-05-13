import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

const PAGE_SIZE = 10
const app = getApp()

const NAV_CONFIG = [
  { id: 1, name: '我的人脉', key: 'Friend' },
  { id: 2, name: '我的收藏', key: 'Favorite' },
]

Page({
  data: {
    NAV: NAV_CONFIG,
    currentTab: NAV_CONFIG[0],
    cardcaseList: null, // 初始化为null，方便页面加载动画展示
    cardcasePagination: { current: 1, total: 0 },
    favoriteList: null, // 初始化为null，方便页面加载动画展示
    favoritePagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
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
      this.loadFriendList(),
      this.loadFavoriteList(),
    ]).then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { currentTab } = this.data
    if (currentTab.key === 'Friend') {
      const { total, current } = this.data.cardcasePagination
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
  loadFriendList(pageNo = 1) {
    // 加载朋友列表数据
    return Api.getFriendList({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        cardcaseList: pageNo === 1 ? list : this.data.cardcaseList.concat(list),
        cardcasePagination: {
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
  handleSwitch(event) {
    const { id } = event.detail
    this.setData({
      currentTab: R.find(R.propEq('id', id), NAV_CONFIG),
    })
  },
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('alumniDetail', { id })
  },
})
