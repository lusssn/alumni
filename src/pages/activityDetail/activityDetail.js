import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

const app = getApp()

Page({
  data: {
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
        res => { this.setData({ activity: res }) },
        () => { },
      )
    })
  },
  onShareAppMessage() {
    const { activity } = this.data
    return {
      title: activity.activityName,
      desc: `邀你一起加入${activity.activityName}`,
      path: `/pages/activityDetail/activityDetail?activityId=${activity.activityId}`
    }
  },
  handleJoinActivity() {
    const { activity } = this.data
    const params = {
      activityId: activity.activityId,
    }
    let operateName = ''
    let next = null
    if (activity.hasEnrolled) {
      operateName = '退出'
      next = Api.quitActivity(params)
    } else {
      operateName = '报名'
      next = Api.joinActivity(params)
    }
    next.then(
      () => {
        wxUtil.showToast(`${operateName}成功`, 'success')
        this.setData({
          activity: R.assoc('hasEnrolled', !activity.hasEnrolled, activity),
        })
        // 报名的时候检查有没有订阅，并申请推送活动消息
        if (!activity.hasEnrolled) {
          wxUtil.requestSubscribeMessage();
        }
      },
      err => {
        wxUtil.showToast(err.errMsg, 'none')
      },
    )

  },
})
