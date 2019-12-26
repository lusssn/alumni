// 活动通知详情页
import wxUtil from '../../utils/wxUtil'
import * as Util from '../../utils/util'
import * as Api from '../api'

Page({
  data: {
    isLoaded: false,
    activity: {},
    creator: {},
  },
  onLoad({ activityId, title, content }) {
    if (!activityId) {
      wxUtil.showToast('不存在此活动')
      return
    }
    wxUtil.login().then(() => {
      // TODO 获取活动内容
      Api.getActivityDetail({ activityId }).then(
        res => {
          this.setData({
            activity: res,
            title: decodeURIComponent(title),
            content: decodeURIComponent(content),
            isLoaded: true,
          })
          Api.getAccountAll({ accountId: res.starterId }).then(
            data => {
              const { account, educations = [], jobs = [] } = data
              const education = educations[0] || {}
              const job = jobs[0] || {}
              this.setData({
                creator: {
                  accountId: account.accountId,
                  name: account.name,
                  avatar: account.avatar,
                  city: account.city,
                  college: education.college,
                  school: education.school,
                  startTime: Util.getYear(education.startTime),
                  company: job.company,
                  position: job.position,
                }
              })
            },
            () => {},
          )
        },
        () => {},
      )
    })
  },
  handleToActivityDetail(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('activityDetail', { activityId: id })
  },
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('detail', { id })
  },
})
