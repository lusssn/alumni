import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'
import moment from '../../utils/moment.min'
import { COLLEGE_TYPE } from '../../macros'

const app = getApp()

Page({
  data: {
    isLoaded: false,
    account: {},
    educations: [],
    jobs: [],
  },
  onLoad() {
    this.loadAllInfo()
  },
  onShow() {
    app.checkNotice('edited', true, this.loadAllInfo)
  },
  onPullDownRefresh() {
    this.loadAllInfo().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  onShareAppMessage() {
    const { account } = this.data
    return {
      title: `${account.real_name}的SEU校友名片`,
      path: `/pages/detail/detail?id=${account.openid}&isShare=1`,
    }
  },
  handleBasicEdit() {
    wxUtil.navigateTo('edit', { type: 'account' })
  },
  handleShare() {},
  handleAbout() {
    wxUtil.navigateTo('about')
  },
  handleEducationAdd(e) {
    const { id } = e.target.dataset
    if (id) {
      wxUtil.navigateTo('edit', {
        type: 'education', id,
      })
      return
    }
    wxUtil.navigateTo('edit', { type: 'education' })
  },
  handleWorkAdd(e) {
    const { id } = e.target.dataset
    if (id) {
      wxUtil.navigateTo('edit', {
        type: 'job', id,
      })
      return
    }
    wxUtil.navigateTo('edit', { type: 'job' })
  },
  loadAllInfo() {
    return wxUtil.login().then(
      () => {
        return Api.getAccountAll({
          myAccountId: app.global.accountId,
          accountId: app.global.accountId,
        }).then(
          data => {
            // 处理时间
            const { birthday } = data.account
            data.account.birthday = moment(birthday).format('YYYY-MM-DD')
            for (let item of data.educations) {
              item.startTime = moment(item.startTime).format('YYYY')
              item.endTime = moment(item.endTime).format('YYYY')
              // 处理院系
              const college = R.find(R.propEq('id', +item.college), COLLEGE_TYPE) || {}
              item.college = college.name
            }
            for (let item of data.jobs) {
              item.startTime = item.startTime ? moment(item.startTime).format('YYYY') : ''
              item.endTime = item.endTime ? moment(item.endTime).format('YYYY') : ''
            }
            this.setData({
              isLoaded: true,
              ...data,
            })
          },
          () => {},
        )
      },
    )
  },
})
