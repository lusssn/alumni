import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Util from '../../utils/util'
import * as Api from '../api'
import { CONTACT_TYPE } from '../../macros'

const PAGE_SIZE = 10
const app = getApp()

Page({
  data: {
    noticeList: [],
    pagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      this.loadList()
    })
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
    return Api.getNoticeList({
      accountId: app.global.accountId,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      list.forEach(item => {
        const contactType = R.find(R.propEq('id', +item.status))(CONTACT_TYPE) || {}
        item.status_name = contactType.name
        item.createTime = Util.getYearMonthDate(item.createTime)
      })
      this.setData({
        noticeList: pageNo === 1 ? list : this.data.noticeList.concat(list),
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
