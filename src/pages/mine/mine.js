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
    // if (!Util.isRegistered()) return
    this.loadAllInfo()
  },
  onShow() {
    app.checkNotice('edited', true, this.loadAllInfo)
    this.loadNoticeList()
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
    if (!Util.isRegistered()) return
    wxUtil.navigateTo('mineDetail')
  },
  handleToCardcase() {
    wxUtil.navigateTo('cardcase')
  },
  handleToMyHubs() {
    wxUtil.navigateTo('myHubs')
  },
  handleToActivity() {
    wxUtil.navigateTo('activity')
  },
  handleToMsgs() {
    wxUtil.navigateTo('noticeList')
  },
  loadNoticeList() {
    return Api.getNoticeList({
      pageIndex: 1,
      pageSize: 10,
    }).then(data => {
      this.setData({
        noticeCount: data.count,
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
  handleShare() {
    const { account, educations } = this.data
    if (!account.name) {
      wxUtil.showToast("请先完成注册")
      return;
    }
    if (educations.length === 0) {
      wxUtil.showToast("请先完善个人信息")
      return;
    }
  },
  handleRegister() {
    Util.isRegistered()
  }
})
