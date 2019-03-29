import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'
import * as R from '../../utils/ramda/index'
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
    return request.getUserInfo().then(({ openId }) => {
      // 加载消息列表数据
      const url = `/friend/getinform/${openId}/${pageNo}/${PAGE_SIZE}`
      return request.get(url).then(({ data }) => {
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
    }, () => {})
  },
  handleClickCard() {
    wxUtil.navigateTo('detail')
  },
})
