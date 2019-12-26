import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import wxUtil from '../../utils/wxUtil'

const app = getApp()

const PAGE_SIZE = 10
const NAV_CONFIG = [
  { id: 1, name: '校友圈推荐', key: 'Hubs' },
  { id: 2, name: '活动推荐', key: 'Activity' },
]
Page({
  data: {
    NAV: NAV_CONFIG,
    currentTab: NAV_CONFIG[0],
    hubList: null,
    hubPagination: { current: 1, total: 0 },
    activityList:[],
    activityPagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      // 加载校友圈列表数据
      this.loadHubsList()
      // 加载活动列表数据
      this.loadActivitiesList()
    })
  },
  onPullDownRefresh() {
    Promise.all([
      this.loadHubsList(),
      this.loadActivitiesList(),
    ]).then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { currentTab } = this.data
    if (currentTab.key === 'Hubs') {
      const { total, current } = this.data.hubPagination
      // 是否为最后一页
      if (Math.ceil(total / PAGE_SIZE) > current) {
        this.loadHubsList(current + 1)
      }
      return
    }
    const { total, current } = this.data.activityPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadActivitiesList(current + 1)
    }
  },
  loadHubsList(pageNo = 1) {
    // 加载校友圈列表数据
    return Api.getHubsRecommend({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        hubList: pageNo === 1 ? list : this.data.hubList.concat(list),
        hubPagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {})
  },
  loadActivitiesList(pageNo = 1){
    // 加载活动列表数据
    return Api.getActivitiesRecommend({
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        activityList: pageNo === 1 ? list : this.data.activityList.concat(list),
        activityPagination: {
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
  handleToHubDetail(event) {
    const { id } = event.currentTarget.dataset
    wxUtil.navigateTo('hubDetail', { hubId: id })
  },
  handleToActivityDetail(event) {
    const { id } = event.currentTarget.dataset
    wxUtil.navigateTo('activityDetail', { activityId: id })
  },
  handleClickSearch() {
    wxUtil.navigateTo('search')
  },
})
