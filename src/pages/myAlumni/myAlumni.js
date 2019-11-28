import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const app = getApp()

const PAGE_SIZE = 10

Page({
  data: {
    alumniList: [
      {
        "alumniCircleMembersNum": 1,
        "alumniCircleId": 222,
        "creatorId": 3245005322240,
        "alumniCircleType": 2,
        "alumniCircleName": "第二个群组",
        "alumniCircleDesc": "这是第二个用以测试的群组。",
        "avatar": null,
        "authorizationStatus": false,
        "creatorName": "杨诗月"
      },
      {
        "alumniCircleMembersNum": 1,
        "alumniCircleId": 222,
        "creatorId": 3245005322240,
        "alumniCircleType": 2,
        "alumniCircleName": "第二个群组",
        "alumniCircleDesc": "这是第二个用以测试的群组。",
        "avatar": null,
        "authorizationStatus": false,
        "creatorName": "杨诗月"
      },
      {
        "alumniCircleMembersNum": 1,
        "alumniCircleId": 222,
        "creatorId": 3245005322240,
        "alumniCircleType": 2,
        "alumniCircleName": "第二个群组",
        "alumniCircleDesc": "这是第二个用以测试的群组。",
        "avatar": null,
        "authorizationStatus": false,
        "creatorName": "杨诗月"
      }
    ],
    messagePagination: { current: 1, total: 0 },
  },
  onLoad() {
    wxUtil.login().then(() => {
      this.loadAlumniList()
    })
  },
  onPullDownRefresh() {
    this.loadAlumniList().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom() {
    const { total, current } = this.data.startedPagination
    // 是否为最后一页
    if (Math.ceil(total / PAGE_SIZE) > current) {
      this.loadAlumniList(current + 1)
    }
  },
  loadAlumniList(pageNo = 1) {
    return Api.getMyAlumni({
      accountId: app.global.accountId,
      pageIndex: pageNo,
      pageSize: PAGE_SIZE,
    }).then(data => {
      const { list, count } = data
      this.setData({
        startedList: pageNo === 1 ? list : this.data.startedList.concat(list),
        startedPagination: {
          current: pageNo,
          total: count,
        },
      })
    }, () => {})
  },
  // 校友圈详情
  handleClickAlumniItem(e) {
    const { id } = e.currentTarget.dataset;
    wxUtil.navigateTo('alumniDetail', { id })
  },
  //创建群通讯录
  handleClickCreate() {
    wxUtil.navigateTo('createGroupBook')
  }
})
