import * as R from '../../utils/ramda/index'

const app = getApp()

const NAV_CONFIG = [
  { id: 1, name: '校友圈推荐', key: 'Hubs' },
  { id: 2, name: '活动推荐', key: 'Activity' },
]
Page({
  data: {
    NAV: NAV_CONFIG,
    currentTab: NAV_CONFIG[0],
    alumniSpaceList: [],
    activityList:[]
  },
  onLoad () {
    // this.loadAllInfo()
  },
  onShow () {
    app.checkNotice('edited', true, this.loadAllInfo)
  },
  onPullDownRefresh () {
    this.loadAllInfo().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onShareAppMessage () {
    const { account, educations } = this.data
    const education = educations[0] || {}
    return {
      title: `${education.school || ''}校友：${account.name}的名片`,
      path: `/pages/detail/detail?id=${account.accountId}&isShare=1`,
    }
  },
  handleSwitch(event) {
    const { id } = event.detail
    this.setData({
      currentTab: R.find(R.propEq('id', id), NAV_CONFIG),
    })
  },
})
