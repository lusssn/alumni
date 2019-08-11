import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { CONTACT_TYPE } from '../../macros'
import { isComplete, promisify } from '../../utils/util'
import moment from '../../utils/moment.min'

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
    wxUtil.login().then(
      () => {
        if (isShare) {
          isComplete().then(res => {
            if (res) {
              this.loadCardInfo(id)
              return
            }
            wxUtil.navigateTo('complete', {
              redirect: 'detail',
              options: JSON.stringify(this.options),
            }, 'all')
          })
          return
        }
        this.loadCardInfo(id)
      },
    )
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
      myAccountId: friendAccountId,
      accountId: app.global.accountId,
    }).then(
      res => {
        const { relationShip, ...data } = res
        const contactType = R.find(R.propEq('id', +relationShip))(CONTACT_TYPE)
        // 处理时间
        const { birthday } = data.account
        if (birthday) {
          data.account.birthday = moment(birthday).format('YYYY-MM-DD')
        }
        for (let item of data.educations) {
          item.startTime = moment(item.startTime).format('YYYY')
          item.endTime = moment(item.endTime).format('YYYY')
        }
        for (let item of data.jobs) {
          item.startTime = item.startTime ? moment(item.startTime).format('YYYY') : ''
          item.endTime = item.endTime ? moment(item.endTime).format('YYYY') : ''
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
    Api.getAcceptFriend({
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
    Api.getRefuseFriend({
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
    const { accountId } = this.data.account
    Api.getInviteFriend({
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
    promisify(wx.setClipboardData)({
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
