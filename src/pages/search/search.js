import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const SEARCH_TYPE = [
  { key: 'name', name: '姓名' },
  { key: 'school', name: '学校' },
  { key: 'college', name: '学院' },
  { key: 'city', name: '城市' },
  { key: 'company', name: '公司' },
  { key: 'position', name: '职位' },
  { key: 'selfDesc', name: '自述' },
  { key: 'hub', name: '校友圈' },
  { key: 'activity', name: '活动' },
]

Page({
  data: {
    SEARCH_TYPE,
    isSearched: false,
    content: '',
    result: {},
  },
  onLoad() {
    wxUtil.login()
  },
  handleSearch(event) {
    const content = event.detail.value
    Promise.all([
      this.loadCardResult(content),
      this.loadHubs(content),
      this.loadActivities(content),
    ]).then(
      ([card, hubs, activity]) => {
        this.setData({
          content,
          result: { ...card, ...hubs, ...activity },
          isSearched: true,
        })
      },
      err => {
        console.error('Hello: ', err)
        wxUtil.showToast('搜索失败')
      }
    )
  },
  loadCardResult(keyword) {
    return Api.getSearch({
      content: keyword,
      type: '',
      pageIndex: 1,
      pageSize: 1,
    }).then(data => {
      const result = {}
      data.forEach(item => {
        result[item.type] = item.count
      })
      return result
    })
  },
  loadHubs(keyword) {
    return Api.searchHubs({
      alumniCircleName: keyword,
      fuzzy: true, // 开启模糊查询
      pageIndex: 1,
      pageSize: 1,
    }).then(data => {
      return { hub: data.count }
    })
  },
  loadActivities(keyword) {
    return Api.searchActivities({
      activityName: keyword,
      fuzzy: true, // 开启模糊查询
      pageIndex: 1,
      pageSize: 1,
    }).then(data => {
      return { activity: data.count }
    })
  },
  handleSearchDetail(event) {
    const { way } = event.currentTarget.dataset
    wxUtil.navigateTo('searchList', {
      content: this.data.content,
      way
    })
  },
})
