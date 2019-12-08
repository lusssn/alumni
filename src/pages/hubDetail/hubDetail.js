import wxUtil from '../../utils/wxUtil'

Page({
  data: {
    activityList: [],
  },
  handleToCreateActivity() {
    // TODO 需要传入圈子id
    wxUtil.navigateTo('activityCreate')
  }
})
