import wxUtil from '../../utils/wxUtil'
import * as Util from '../../utils/util'
import * as Api from '../api'

Page({
  data: {
    isLoaded: false,
    hubInfo: {},
    creator: {},
  },
  onLoad({ hubId }) {
    if (!hubId) {
      wxUtil.showToast('不存在此校友圈')
      return
    }
    wxUtil.login().then(() => {
      Api.getHubInfo({
        alumniCircleId: hubId,
      }).then(
        res => {
          this.setData({ hubInfo: res, isLoaded: true })
          Api.getAccountAll({ accountId: res.creatorId }).then(
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
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('detail', { id })
  },
})
