// 我发起的活动详情页
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'
import moment from '../../utils/moment.min'

const PAGE_SIZE = 10

Page({
  data: {
    memberList: null,
    memberPagination: { current: 1, total: 0 },
    activity: {},
    
  },
  onLoad({ activityId }) {
    if (!activityId) {
      wxUtil.showToast('不存在此活动')
      return
    }
    // 加载详情数据
    wxUtil.login().then(() => {
      Api.getActivityDetail({ activityId }).then(
        res => {
          this.setData({
            activity: R.assoc(
              'expirationDateTime',
              moment(res.expirationDateTime).format('YYYY-MM-DD'),
              res,
            ),
          })
        },
        () => {},
      )
      this.loadMemberList()
    })
  },
  onPullDownRefresh() {
    this.loadMemberList().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.memberPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadMemberList(current + 1)
    }
  },
  loadMemberList(pageNo = 1) {
    const currentPage = getCurrentPages().pop()
    // 加载朋友列表数据
    return Api.getActivityMembers({
      activityId: currentPage.options.activityId,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        memberList: pageNo === 1 ? list : this.data.memberList.concat(list),
        memberPagination: {
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
  handleBatchNotice() {
    const currentPage = getCurrentPages().pop()
    wxUtil.navigateTo('noticePost', {
      activityId: currentPage.options.activityId,
    })
  },
})
