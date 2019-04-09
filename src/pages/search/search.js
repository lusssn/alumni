import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const SEARCH_TYPE = [
  { key: 'name', name: '姓名' },
  { key: 'school', name: '学校' },
  { key: 'department', name: '学院' },
  { key: 'city', name: '城市' },
  { key: 'company', name: '公司' },
  { key: 'job', name: '职位' },
  { key: 'descr', name: '自述' },
]

Page({
  data: {
    SEARCH_TYPE,
    isSearched: false,
    content: '',
    result: {},
  },
  handleSearch(e) {
    const content = e.detail.value
    Api.getSearch({ content }).then(data => {
      this.setData({
        content,
        result: data,
        isSearched: true,
      })
    }, () => {})
  },
  handleSearchDetail(e) {
    const { way } = e.currentTarget.dataset
    wxUtil.navigateTo('searchList', {
      content: this.data.content,
      way
    })
  },
  handleGoBack() {
    wx.navigateBack()
  },
})
