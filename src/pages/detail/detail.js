import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { CONTACT_TYPE } from '../../macros'
import * as Util from '../../utils/util'

const app = getApp()

Page({
  data: {
    account: {},
    educations: [],
    jobs: [],
    status: '',
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
    const { account } = this.data
    return {
      title: `${account.name}的名片`,
      path: `/pages/detail/detail?id=${account.accountId}&isShare=1`,
    }
  },
  loadCardInfo(friendAccountId) {
    return Api.getAccountAll({
      myAccountId: app.global.accountId,
      accountId: friendAccountId,
    }).then(
      res => {
        const { relationShip, ...data } = res
        const contactType = R.find(R.propEq('id', +relationShip))(CONTACT_TYPE)
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
          ...data,
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
      wxUtil.showToast('已拒绝', 'success')
      this.loadCardInfo(accountId)
    }, () => {
      wxUtil.showToast('操作失败')
    })
  },
  handleApplyExchange() {
    if (!Util.isRegistered()) return
    const { accountId } = this.data.account
    Api.applyFriend({
      A: app.global.accountId,
      B: accountId,
    }).then(() => {
      wxUtil.showToast('申请已发出', 'success')
      this.loadCardInfo(accountId)
    }, err => {
      wxUtil.showToast(err.errMsg || '操作失败')
    })
  },
  handleAddWechat() {
    const { wechat } = this.data.account
    if (!wechat) {
      wxUtil.showToast('暂未填写微信')
      return
    }
    Util.promisify(wx.setClipboardData)({
      data: wechat,
    }).then(
      () => {
        wxUtil.showToast('复制微信号成功', 'success')
      },
      () => {
        wxUtil.showToast('操作失败')
      },
    )
  },
  handleAddPhone() {
    const { phone, name } = this.data.account
    if (!phone) {
      wxUtil.showToast('暂未填写电话')
      return
    }
    wx.addPhoneContact({
      firstName: name, //联系人姓名
      mobilePhoneNumber: phone, //联系人手机号
    })
  },
})
