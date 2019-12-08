import wxUtil from '../../utils/wxUtil'

Page({
  data: {
    activityList: [],
  },
  handleToHubMembers() {
    // TODO 需要传入圈子id
    wxUtil.navigateTo('hubMembers')
  },
  handleToCreateActivity() {
    // TODO 需要传入圈子id
    wxUtil.navigateTo('activityCreate')
  }
})
