import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

const IMAGE_COUNT = 6
const IMAGE_WIDTH = 606 // 单位rpx

Page({
  data: {
    activity: {},
    images: [],
    showTipComponent: false,
  },
  onLoad({ activityId }) {
    if (!activityId) {
      wxUtil.showToast('不存在此活动')
      return
    }
    // 加载详情数据
    wxUtil.login().then(() => {
      Api.getActivityDetail({ activityId }).then(
        res => {
          const images = []
          for (let i = 1; i <= IMAGE_COUNT; i++) {
            const url = res[`img${i}`]
            url && images.push({ url })
          }
          this.setData({
            activity: res,
            images,
          })
        },
        () => {},
      )
    })
  },
  onShareAppMessage() {
    const { activity } = this.data
    return {
      title: `邀请你参与活动：${activity.activityName}`,
      path: `/pages/activityDetail/activityDetail?activityId=${activity.activityId}`,
    }
  },
  handleLoadImage(event) {
    const { images } = this.data
    const { height, width } = event.detail
    const { index } = event.target.dataset
    this.setData({
      images: R.assocPath(
        [index],
        R.mergeRight(images[index], {
          height: height / width * IMAGE_WIDTH,
        }),
        images,
      ),
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
        // 报名的时候检查有没有订阅，并申请推送活动消息
        if (!activity.hasEnrolled) {
          this.setData({
            showTipComponent: true,
          })
          // 订阅消息
          wxUtil.requestSubscribeMessage().then(flag => {
            this.setData({
              showTipComponent: false,
            })
          })
        }
      },
      err => {
        wxUtil.showToast(err.errMsg, 'none')
      },
    )
  },
})
