import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const app = getApp()
const PAGE_SIZE = 10

Page({
  data: {
    isCreator: false, // 当前圈子是否是自己创建的
    isJoined: false, // 是圈子成员
    hubInfo: {},
    memberList: [],
    activityList: [],
    activityPagination: { current: 1, total: 0 },
  },
  onLoad({ hub }) {
    if (!hub) {
      wxUtil.showToast('不存在此校友圈')
      return
    }
    wxUtil.login().then(() => {
      this.loadHubInfo()
      // 获取成员列表
      this.loadHubMembers()
      this.loadHubActivities()
    })
  },
  onPullDownRefresh() {
    Promise.all([
      this.loadHubInfo(),
      this.loadHubMembers(),
      this.loadHubActivities(),
    ]).then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.activityPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadHubActivities(current + 1)
    }
  },
  loadHubInfo() {
    const currentPage = getCurrentPages().pop()
    Api.getHubInfo({
      alumniCircleId: currentPage.options.hub,
    }).then(
      res => {
        this.setData({
          hubInfo: res,
          isCreator: res.creatorId === app.global.accountId,
          isJoined: res.isJoined,
        })
      },
      () => {},
    )
  },
  // 获取成员列表
  loadHubMembers() {
    const currentPage = getCurrentPages().pop()
    return Api.getHubMembers({
      alumniCircleId: currentPage.options.hub,
      pageIndex: 1,
      pageSize: 3,
    }).then(data => {
      this.setData({ memberList: data.list })
    }, () => {})
  },
  loadHubActivities(pageNo = 1) {
    const currentPage = getCurrentPages().pop()
    // 加载校友圈下活动列表数据
    return Api.getHubActivities({
      alumniCircleId: currentPage.options.hub,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      list.forEach(item => {
        item.activityDateTime = item.activityDateTime.split(' ')[0]
      })
      this.setData({
        activityList: pageNo === 1 ? list : this.data.activityList.concat(list),
        activityPagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {})
  },
  handleToHubInfo() {
    const currentPage = getCurrentPages().pop()
    wxUtil.navigateTo('hubInfo', {
      hub: currentPage.options.hub,
    })
  },
  handleToHubMembers() {
    const currentPage = getCurrentPages().pop()
    wxUtil.navigateTo('hubMembers', {
      hub: currentPage.options.hub,
    })
  },
  handleToCreateActivity() {
    const currentPage = getCurrentPages().pop()
    wxUtil.navigateTo('activityCreate', {
      hub: currentPage.options.hub,
    })
  },
  handleToHubCreate() {
    const currentPage = getCurrentPages().pop()
    wxUtil.navigateTo('hubCreate', {
      hub: currentPage.options.hub,
    })
  },
  handleToActivityDetail(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('activityDetail', { activity: id })
  },
  handleJoinHub() {
    Api.joinHub({
      alumniCircleId: this.data.hubInfo.alumniCircleId,
    }).then(
      () => {
        wxUtil.showToast('加入成功', 'success')
        this.setData({
          isJoined: true
        })
        this.loadHubMembers()
      },
      (err) => {
        console.error(err)
        wxUtil.showToast('加入失败请重试')
      },
    )
  },
  handleExitHub() {
    Api.exitHub({
      alumniCircleId: this.data.hubInfo.alumniCircleId,
    }).then(
      () => {
        wxUtil.showToast('退出成功', 'success')
        this.setData({
          isJoined: false
        })
        this.loadHubMembers()
      },
      (err) => {
        console.error(err)
        wxUtil.showToast('退出失败请稍后重试')
      },
    )
  },
})
