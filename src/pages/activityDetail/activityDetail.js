import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

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
      },
      err => {
        console.error(err)
        wxUtil.showToast(`${operateName}失败请重试`)
      },
    )

  },
})
