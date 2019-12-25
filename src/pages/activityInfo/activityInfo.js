import wxUtil from '../../utils/wxUtil'
import * as Util from '../../utils/util'
import * as Api from '../api'

Page({
  data: {
    isLoaded: false,
    hubInfo: {},
    creator: {},
  },
  onLoad({ activityId }) {
    if (!activityId) {
      wxUtil.showToast('不存在此活动')
      return
    }
    wxUtil.login().then(() => {
      // TODO 获取活动通知内容
    })
  },
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('detail', { id })
  },
})
