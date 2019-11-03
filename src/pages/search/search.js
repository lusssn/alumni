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
]

Page({
  data: {
    SEARCH_TYPE,
    isSearched: false,
    content: '',
    result: {},
  },
  handleSearch(event) {
    const content = event.detail.value
    Api.getSearch({
      content,
      type: '',
      pageIndex: 1,
      pageSize: 1,
    }).then(data => {
      const result = {}
      data.forEach(item => {
        result[item.type] = item.count
      })
      this.setData({
        content,
        result,
        isSearched: true,
      })
    }, () => {})
  },
  handleSearchDetail(event) {
    const { way } = event.currentTarget.dataset
    wxUtil.navigateTo('searchList', {
      content: this.data.content,
      way
    })
  },
})
