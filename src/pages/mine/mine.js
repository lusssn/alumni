import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as Util from '../../utils/util'

const app = getApp()

Page({
  data: {
    isLoaded: false,
    account: {},
    educations: [],
    jobs: [],
    noticeCount: 0,
  },
  onLoad() {
    this.loadAllInfo()
  },
  onShow() {
    app.checkNotice('edited', true, this.loadAllInfo)
  },
  onPullDownRefresh() {
    this.loadAllInfo().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onShareAppMessage() {
    const { account, educations } = this.data
    const education = educations[0] || {}
    return {
      title: `${education.school || ''}校友：${account.name}的名片`,
      path: `/pages/detail/detail?id=${account.accountId}&isShare=1`,
    }
  },
  handleEdit() {
    wxUtil.navigateTo('edit', { type: 'account' })
  },
  handleToCardcase() {
    wxUtil.navigateTo('friend')
  },
  handleToAlumni() {
    wxUtil.navigateTo('hubs')
  },
  handleToActivity() {
    wxUtil.navigateTo('activity')
  },
  handleToMsgs() {
    wxUtil.navigateTo('notice')
  },
  loadNoticeList() {
    return Api.getNoticeList({
      pageIndex: 1,
      pageSize: 10,
    }).then(data => {
      const { count } = data
      this.setData({
        noticeCount: count
      })
    }, () => { })
  },
  loadAllInfo() {
    return wxUtil.login().then(
      isLogin => {
        if (!isLogin) {
          this.setData({ isLoaded: true })
          return Promise.resolve()
        }
        return Api.getAccountAll({
          accountId: app.global.accountId,
        }).then(
          data => {
            this.loadNoticeList()
            for (let item of data.educations) {
              item.startTime = Util.getYear(item.startTime)
              item.endTime = Util.getYear(item.endTime)
            }
            this.setData({
              isLoaded: true,
              ...data,
            })
          },
          () => { },
        )
      },
    )
  },
  handleRegister() {
    Util.isRegistered()
  }
})
