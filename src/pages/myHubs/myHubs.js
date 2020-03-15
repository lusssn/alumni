import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const PAGE_SIZE = 10

const ALUMNI_CIRCLE = "ALUMNI_CIRCLE" //校友圈
const ORDINARY_GROUP = "ORDINARY_GROUP" // 群组

const IS_AUTHORIZED = "IS_AUTHORIZED" // 官方认证
const NOT_AUTHORIZED = "NOT_AUTHORIZED" // 未认证

Page({
  data: {
    ALUMNI_CIRCLE,
    IS_AUTHORIZED,
    hubList: null,
    hubPagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      this.loadHubList()
    })
  },
  onPullDownRefresh() {
    this.loadHubList().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.hubPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadHubList(current + 1)
    }
  },
  loadHubList(pageNo = 1) {
    return Api.getMyHubs({
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
    }, () => { })
  },
  // 跳转到圈子详情
  handleClickHub(e) {
    const { id } = e.currentTarget.dataset;
    wxUtil.navigateTo('hubDetail', { hubId: id })
  },
  // 创建校友圈
  handleCreateHub() {
    wxUtil.navigateTo('hubCreate')
  }
})
