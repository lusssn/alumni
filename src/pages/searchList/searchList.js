import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const PAGE_SIZE = 10

Page({
  data: {
    content: '',
    type: '',
    list: [],
    pagination: { current: 1, total: 0 },
  },
  onLoad({ content, way }) {
    this.setData({
      content: decodeURI(content),
      type: way,
    })
    this.loadData()
  },
  onReachBottom() {
    const { current, total } = this.data.pagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadData(current + 1)
    }
  },
  loadData(pageNo = 1) {
    const { type } = this.data
    if (type === 'hub') {
      this.loadHubs(pageNo)
    } else if (type === 'activity') {
      this.loadActivities(pageNo)
    } else {
      this.loadCardResult(pageNo)
    }
  },
  loadCardResult(pageNo = 1) {
    const { content, type } = this.data
    return Api.getSearch({
      content,
      type,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(res => {
      const data = res[0] || {}
      const { list = [], count = 0 } = data
      this.setData({
        list: pageNo === 1 ? list : this.data.list.concat(list),
        pagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {
      wxUtil.showToast('搜索失败')
    })
  },
  loadHubs(pageNo = 1) {
    return Api.searchHubs({
      alumniCircleName: this.data.content,
      fuzzy: true, // 开启模糊查询
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list = [], count = 0 } = data
      this.setData({
        list: pageNo === 1 ? list : this.data.list.concat(list),
        pagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {
      wxUtil.showToast('搜索失败')
    })
  },
  loadActivities(pageNo = 1) {
    return Api.searchActivities({
      activityName: this.data.content,
      fuzzy: true, // 开启模糊查询
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list = [], count = 0 } = data
      this.setData({
        list: pageNo === 1 ? list : this.data.list.concat(list),
        pagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {
      wxUtil.showToast('搜索失败')
    })
  },
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('detail', { id })
  },
  // 跳转到圈子详情
  handleClickHub(e) {
    const { id } = e.currentTarget.dataset;
    wxUtil.navigateTo('hubDetail', { hubId: id })
  },
  handleToActivityDetail(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('activityDetail', { activityId: id })
  },
})
