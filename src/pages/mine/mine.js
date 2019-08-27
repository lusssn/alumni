import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'
import * as Util from '../../utils/util'
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
    const { account, educations } = this.data
    const education = educations[0] || {}
    return {
      title: `${education.school || ''}校友：${account.name}的名片`,
      path: `/pages/detail/detail?id=${account.accountId}&isShare=1`,
    }
  },
  handleBasicEdit() {
    wxUtil.navigateTo('edit', { type: 'account' })
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
      isLogin => {
        if (!isLogin) {
          this.setData({ isLoaded: true })
          return Promise.resolve()
        }
        return Api.getAccountAll({
          accountId: app.global.accountId,
        }).then(
          data => {
            // 处理时间
            const { birthday } = data.account
            data.account.birthday = Util.getYearMonthDate(birthday)
            for (let item of data.educations) {
              item.startTime = Util.getYear(item.startTime)
              item.endTime = Util.getYear(item.endTime)
              // 处理院系
              const college = R.find(R.propEq('id', +item.college), COLLEGE_TYPE) || {}
              item.college = college.name
            }
            for (let item of data.jobs) {
              item.startTime = Util.getYear(item.startTime)
              item.endTime = Util.getYear(item.endTime)
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
  handleRegister() {
    Util.isRegistered()
  }
})
