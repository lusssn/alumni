import * as Api from '../api'
import wxUtil from '../../utils/wxUtil'

const PAGE_SIZE = 10

Page({
  data: {
    keyword: '',
    list: [],
    pagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      this.loadHubMembers()
    })
  },
  onPullDownRefresh() {
    this.loadHubMembers().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.pagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadHubMembers(current + 1)
    }
  },
  handleSearch(event) {
    const content = event.detail.value
    this.setData({
      keyword: content,
    }, () => {
      this.loadHubMembers()
    })
  },
  loadHubMembers(pageNo = 1) {
    const currentPage = getCurrentPages().pop()
    return Api.getHubMembers({
      alumniCircleId: currentPage.options.hubId,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
      query: this.data.keyword,
    }).then(data => {
      const { list, count } = data
      this.setData({
        list: pageNo === 1 ? list : this.data.list.concat(list),
        pagination: {
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
})
