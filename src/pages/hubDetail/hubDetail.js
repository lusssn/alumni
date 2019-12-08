import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const PAGE_SIZE = 10

Page({
  data: {
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
      Api.getHubInfo({ alumniCircleId: hub }).then(
        res => {
          this.setData({ hubInfo: res })
        },
        () => {},
      )
      // 获取成员列表
      Api.getHubMembers({
        alumniCircleId: hub,
        pageIndex: 1,
        pageSize: 3,
      }).then(data => {
        const { list, count } = data
        this.setData({ memberList: list })
      }, () => {})
      this.loadHubActivities()
    })
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
      this.setData({
        activityList: pageNo === 1 ? list : this.data.activityList.concat(list),
        activityPagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {})
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
})
