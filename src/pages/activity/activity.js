import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

const PAGE_SIZE = 10
const app = getApp()

const NAV_CONFIG = [
  { id: 1, name: '我参与的', key: 'Enrolled' },
  { id: 2, name: '我发起的', key: 'Started' },
]

Page({
  data: {
    NAV: NAV_CONFIG,
    currentTab: NAV_CONFIG[0],
    enrolledList: null,
    enrolledPagination: { current: 1, total: 0 },
    startedList: null,
    startedList: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      // 加载参与的活动和组织的活动
      this.loadenrolledList()
      this.loadstartedList()
    })
  },
  onPullDownRefresh() {
    Promise.all([
      this.loadenrolledList(),
      this.loadstartedList(),
    ]).then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { currentTab } = this.data
    if (currentTab.key === 'Enrolled') {
      const { total, current } = this.data.enrolledPagination
      // 是否为最后一页
      if (Math.ceil(total / PAGE_SIZE) > current) {
        this.loadEnrolledList(current + 1)
      }
      return
    }
    const { total, current } = this.data.startedPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadStartedList(current + 1)
    }
  },
  loadenrolledList(pageNo = 1) {
    // 加载参与的活动列表数据
    return Api.getEnrolledActivities({
      accountId: app.global.accountId,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        enrolledList: pageNo === 1 ? list : this.data.enrolledList.concat(list),
        enrolledPagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => { })
  },
  loadstartedList(pageNo = 1) {
    // 加载发起的活动列表
    return Api.getStartedActivities({
      accountId: app.global.accountId,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        startedList: pageNo === 1 ? list : this.data.startedList.concat(list),
        startedPagination: {
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
  handleToActivityDetail(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('activityDetail', { id })
  }, 
  handleToMyActivity(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('myActivity', { id })
  },
})
