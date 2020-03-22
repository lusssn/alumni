import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as Util from '../../utils/util'

const app = getApp()

Page({
  data: {
    isLoaded: false,
    account: {},
    educations: [],
    jobs: [],
    noticeCount: 0,
    subscribeStatus: true,
  },
  onLoad() {
    wxUtil.login().then((isLogin) => {
      this.loadAllInfo(isLogin);
      wxUtil.getNoticeCount().then(count => {
        this.setData({ noticeCount: count })
        if (count > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: count.toString(),
          })
        } else {
          wx.removeTabBarBadge({
            index: 2,
          })
        }
      })
    })
  },
  onPullDownRefresh() {
    wxUtil.login().then((isLogin) => {
      Promise.all([
        this.loadAllInfo(isLogin),
        wxUtil.getNoticeCount().then(count => {
          this.setData({ noticeCount: count })
          if (count > 0) {
            wx.setTabBarBadge({
              index: 2,
              text: count.toString(),
            })
          } else {
            wx.removeTabBarBadge({
              index: 2,
            })
          }
        })]).then(() => {
          wx.stopPullDownRefresh()
        })
    })
  },
  onShow() {
    app.checkNotice('edited', true, this.loadAllInfo)
    // 检查消息订阅状态
    wxUtil.checkSubscribeStatus().then(flag => {
      // flag —— true：永久订阅  false：一次订阅/未订阅
      this.setData({ subscribeStatus: flag })
      if (this.data.noticeCount > 0) {
        wx.setTabBarBadge({
          index: 2,
          text: this.data.noticeCount.toString(),
        })
      }
    });
  },
  onShareAppMessage() {
    const { account, educations } = this.data
    const education = educations[0] || {}
    return {
      title: `${education.school || ''}校友：${account.name}的名片`,
      path: `/pages/detail/detail?id=${account.accountId}&isShare=1`,
    }
  },
  handleEdit() {
    if (!Util.isRegistered()) return
    wxUtil.navigateTo('mineDetail')
  },
  handleToCardcase() {
    wxUtil.navigateTo('cardcase')
  },
  handleToMyHubs() {
    wxUtil.navigateTo('myHubs')
  },
  handleToActivity() {
    wxUtil.navigateTo('activity')
  },
  handleToMsgs() {
    wxUtil.requestSubscribeMessage();
    wxUtil.navigateTo('noticeList')
  },
  loadAllInfo(isLogin) {
    if (!isLogin) {
      this.setData({ isLoaded: true })
      return Promise.resolve()
    }
    return Api.getAccountAll({
      accountId: app.global.accountId,
    }).then(
      data => {
        for (let item of data.educations) {
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
  handleShare() {
    const { account, educations } = this.data
    if (!account.name) {
      wxUtil.showToast("请先完成注册")
      return;
    }
    if (educations.length === 0) {
      wxUtil.showToast("请先完善个人信息", null)
      return;
    }
    wxUtil.showToast("点击右上角转发分享", 'none')
  },
  handleRegister() {
    Util.isRegistered()
  },
  handleSubscribe() {
    wx.showToast({
      title: '建议勾选最下方长期订阅',
      icon: 'none',
      duration: 10000,
    })
    // 订阅消息
    wxUtil.requestSubscribeMessage().then(flag => {
      wx.hideToast()
      // 点击确认
      if (flag) {
        // 再次检查订阅状态，newFlag —— true: 永久订阅 false: 单次订阅
        wxUtil.checkSubscribeStatus().then(newFlag => {
          this.setData({ subscribeStatus: newFlag })
        });
      }
    })
  }
})
