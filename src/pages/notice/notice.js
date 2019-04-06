import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { CONTACT_TYPE } from '../../macro'

const PAGE_SIZE = 10

Page({
  data: {
    noticeList: [],
    pagination: { current: 1, total: 0 },
  },
  onLoad() {
    this.loadList()
  },
  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.pagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadList(current + 1)
    }
  },
  loadList(pageNo = 1) {
    // 加载消息列表数据
    return Api.fetchNoticeList({
      limit: PAGE_SIZE,
      page: pageNo,
    }).then(data => {
      const { result, count } = data
      result.forEach(item => {
        const contactType = R.find(R.propEq('id', +item.state))(CONTACT_TYPE) || {}
        item.status_name = contactType.name
      })
      this.setData({
        noticeList: pageNo === 1 ? result : this.data.noticeList.concat(result),
        pagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {})
  },
  handleClickCard() {
    wxUtil.navigateTo('detail')
  },
})
