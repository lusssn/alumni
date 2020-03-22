import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as Util from '../../utils/util'

const app = getApp()

Page({
  data: {
    isShowAuthModal: false,
    isLoaded: false,
    account: {},
    educations: [],
    jobs: [],
  },
  onLoad() {
    this.loadAllInfo().then(() => {
      this.updateAvatarUrl();
    });
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
  updateAvatarUrl() {
    wxUtil.getUserInfo().then(() => {
    }, () => {
      // 未授权，显示授权弹窗
      this.setData({
        isShowAuthModal: true,
      })
    })
    Util.promisify(wx.getSetting)().then(
      ({ authSetting }) => {
        if (authSetting['scope.userInfo']) {
          Util.promisify(wx.getUserInfo)().then(
            ({ userInfo: realInfo }) => {
              let realAvatar = realInfo.avatarUrl;
              Api.updateAvatarUrl({
                url: realAvatar,
              }).then(({ data }) => {
                this.setData({
                  account: {
                    ...this.data.account,
                    avatar: data,
                  }
                })
              })
            },
            () => Promise.reject(Error.AUTH_FAILED),
          )
        }
        return Promise.reject(Error.UNAUTHORIZED)
      },
      () => Promise.reject(Error.AUTH_FAILED),
    )
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
          () => { },
        )
      },
    )
  },
  handleRegister() {
    Util.isRegistered()
  }
})
