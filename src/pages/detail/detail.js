import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { GENDER_TYPE, CONTACT_TYPE } from '../../macros'
import * as Util from '../../utils/util'

const app = getApp()

Page({
  data: {
    account: {},
    educations: [],
    jobs: [],
    status: '',
    showModal: false,
    message: '',
  },
  onLoad({ id, isShare }) {
    if (!id) {
      wxUtil.showToast('不存在此人')
      return
    }
    // 加载详情数据
    wxUtil.login().then(() => {
      this.loadCardInfo(id)
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
  loadCardInfo(friendAccountId) {
    return Api.getAccountAll({
      accountId: friendAccountId,
    }).then(
      res => {
        const { relationShip, account, educations, jobs, ...data } = res
        const contactType = R.find(R.propEq('id', +relationShip))(CONTACT_TYPE)
        // 处理性别
        account.gender = R.find(R.propEq('id', account.gender), GENDER_TYPE).key
        // 处理时间
        account.birthday = Util.getYearMonthDate(account.birthday)
        for (let item of educations) {
          item.startTime = Util.getYear(item.startTime)
          item.endTime = Util.getYear(item.endTime)
        }
        for (let item of jobs) {
          item.startTime = Util.getYear(item.startTime)
          item.endTime = Util.getYear(item.endTime)
        }
        this.setData({
          ...data,
          account,
          educations,
          jobs,
          status: contactType.key,
        })
      },
      () => {
        wxUtil.showToast('获取详情失败')
      },
    )
  },
  handleAccept() {
    const { accountId } = this.data.account
    Api.requestFriend({
      action: 1,
      A: app.global.accountId,
      B: accountId,
    }).then(() => {
      wxUtil.showToast('已同意', 'success')
      this.loadCardInfo(accountId)
    }, () => {
      wxUtil.showToast('操作失败')
    })
  },
  handleRefuse() {
    const { accountId } = this.data.account
    Api.requestFriend({
      action: 0,
      A: app.global.accountId,
      B: accountId,
    }).then(() => {
      wxUtil.showToast('已忽略', 'success')
      this.loadCardInfo(accountId)
    }, () => {
      wxUtil.showToast('操作失败')
    })
  },
  handleApplyExchange() {
    if (!Util.isRegistered()) return
    this.setData({
      showModal: true
    })
  },
  handleMessageInput(event) {
    this.setData({
      message: event.detail.value
    })
  },
  handleApplyCancel() {
    this.setData({
      showModal: false,
      message: '',
    })
  },
  handleApplySend() {
    const { accountId } = this.data.account
    Api.applyFriend({
      A: app.global.accountId,
      B: accountId,
    }).then(() => {
      wxUtil.showToast('申请已发出', 'success')
      this.loadCardInfo(accountId)
      this.setData({
        showModal: false,
        message: '',
      })
    }, err => {
      wxUtil.showToast(err.errMsg || '操作失败')
    })
  },
  handleFavorite() {
    const { account, favorite } = this.data
    const status = favorite ? 0 : 1
    Api.favoriteFriend({
      favoriteAccountId: account.accountId,
      status,
    }).then(() => {
      this.setData({
        favorite: status,
      })
      app.setNotice('favorited', true)
      wxUtil.showToast('操作成功', 'success')
    }, () => {
      wxUtil.showToast('操作失败')
    })
  },
})
