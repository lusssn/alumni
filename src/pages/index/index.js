import { isComplete } from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const PAGE_SIZE = 10

Page({
  data: {
    isLoaded: false,
    list: null,
    pagination: { current: 1, total: 0 },
  },
  onLoad() {
    isComplete().then(res => {
      if (res) {
        this.loadSquareCards()
        return
      }
      wxUtil.navigateTo('complete', {}, 'all')
    })
  },
  onPullDownRefresh() {},
  onReachBottom() {
    const { current, total } = this.data.pagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadSquareCards(current + 1)
    }
  },
  loadSquareCards(pageNo = 1) {
    Api.getSquareCards({
      limit: PAGE_SIZE,
      page: pageNo,
    }).then(res => {
      const { data, count } = res
      this.setData({
        list: pageNo === 1 ? data : this.data.list.concat(data),
        pagination: {
          current: pageNo,
          total: count,
        },
      })
    }, err => wxUtil.showToast(err.errMsg))
  },
  handleClickSearch() {
    wxUtil.navigateTo('search')
  },
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('detail', { id })
  },
})
