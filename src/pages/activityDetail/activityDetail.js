import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

Page({
  data: {
    activity: {},
  },
  onLoad({ id }) {
    if (!id) {
      wxUtil.showToast('不存在此活动')
      return
    }
    // 加载详情数据
    wxUtil.login().then(() => {
      Api.getActivityDetail({ activityId: id }).then(
        res => { this.setData({ activity: res }) },
        () => {},
      )
    })
  }
})
