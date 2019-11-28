import * as R from '../../utils/ramda/index'

const app = getApp()

const NAV_CONFIG = [
  { id: 1, name: '校友圈推荐', key: 'alumniSpace' },
  { id: 2, name: '活动推荐', key: 'activity' },
]
Page({
  data: {
    NAV: NAV_CONFIG,
    currentTab: NAV_CONFIG[0],
    isLoaded: true,
    alumniSpaceList: [
      {
        alumniSpaceId: '1',
        name: '东南大学南京校友会',
        desc: '该圈子聚集了来自东南大学在南京的校友们， 欢迎您的加入',
        isCertified: true,
      },
      {
        alumniSpaceId: '2',
        name: '测试2',
        desc: '测试2',
        isCertified: true,
      },
    ],
    activityList:[
      {
        activityId: '1',
        name: '测试1',
        desc: '测试1',
      }
    ]
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
