import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const PAGE_SIZE = 10

Page({
  data: {
    params: {},
    list: [],
    pagination: { current: 1, total: 0 },
  },
  onLoad({ content, way }) {
    this.setData({
      params: {
        content: decodeURI(content),
        way,
      }
    })
    this.loadSearchList()
  },
  onReachBottom() {
    const { current, total } = this.data.pagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadSearchList(current + 1)
    }
  },
  loadSearchList(pageNo = 1) {
    Api.getSearchResult({
      ...this.data.params,
      limit: PAGE_SIZE,
      page: pageNo,
    }).then(data => {
      const { result, count } = data
      this.setData({
        list: pageNo === 1 ? result : this.data.list.concat(result),
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
})
