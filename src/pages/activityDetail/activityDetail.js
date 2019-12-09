import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const app = getApp()

Page({
  data: {
    activity: {},
  },
  onLoad({ activity }) {
    if (!activity) {
      wxUtil.showToast('不存在此活动')
      return
    }
    // 加载详情数据
    wxUtil.login().then(() => {
      Api.getActivityDetail({ activityId: activity }).then(
        res => { this.setData({ activity: res }) },
        () => {},
      )
    })
  },
  handleJoinActivity() {
    Api.joinActivity({
      activityId: this.data.activity.activityId,
      accountId: app.global.accountId,
    }).then(
      () => {},
      () => {},
    )
  }
})
