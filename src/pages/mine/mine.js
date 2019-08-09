import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import _request from '../../utils/_request'

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
    const app = getApp()
    app.checkNotice('editedBasic', true, this.updateBasic)
    app.checkNotice('editedEducation', true, this.updateEducation)
    app.checkNotice('editedWork', true, this.updateWork)
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
    const { num } = e.target.dataset
    if (num) {
      wxUtil.navigateTo('edit', {
        type: 'job',
        id: num,
      })
      return
    }
    wxUtil.navigateTo('edit', { type: 'job' })
  },
  loadAllInfo() {
    return _request.login().then(
      accountId => {
        return Api.getAccountAll({ accountId }).then(
          data => {
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
  updateBasic() {
    Api.getBasicInfo().then(data => {
      const { base, personal } = data
      this.setData({
        account: { ...base[0], ...personal[0] },
      })
    }, () => {})
  },
  updateEducation() {
    Api.getEducationInfo().then(data => {
      this.setData({ educations: data })
    }, () => {})
  },
  updateWork() {
    Api.getWorkInfo().then(data => {
      this.setData({ jobs: data })
    }, () => {})
  },
})
