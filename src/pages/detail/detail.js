import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { CONTACT_TYPE } from '../../macro'
import { isComplete } from '../../utils/util'

Page({
  data: {
    basic: {},
    educations: [],
    works: [],
    status: '',
  },
  onLoad({ id, isShare }) {
    if (!id) {
      wxUtil.showToast('不存在此人')
      return
    }
    // 加载详情数据
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
  onShareAppMessage() {
    const { basic } = this.data
    return {
      title: `${basic.real_name}的名片`,
      path: `/pages/detail/detail?id=${basic.openid}&isShare=1`,
    }
  },
  loadCardInfo(cardId) {
    return Api.getCardInfo({ cardid: cardId }).then(data => {
      const { personalinfor, personal = [], education, work, state } = data
      const contactType = R.find(R.propEq('id', +state))(CONTACT_TYPE)
      this.setData({
        basic: { ...personalinfor[0], ...personal[0] },
        educations: education,
        works: work,
        status: contactType.key,
      })
    }, () => {
      wxUtil.showToast('获取详情失败')
    })
  },
  handleAccept() {
    const { openid } = this.data.basic
    Api.getAcceptFriend({ friendid: openid }).then(() => {
      wxUtil.showToast('已同意', 'success')
      this.loadCardInfo(basic.id)
    }, () => {
      wxUtil.showToast('操作失败')
    })
  },
  handleRefuse() {
    const { openid } = this.data.basic
    Api.getRefuseFriend({ friendid: openid }).then(() => {
      wxUtil.showToast('已拒绝', 'success')
      this.loadCardInfo(openid)
    }, () => {
      wxUtil.showToast('操作失败')
    })
  },
  handleApplyExchange() {
    const { openid } = this.data.basic
    Api.getInviteFriend({ friendid: openid }).then(() => {
      wxUtil.showToast('申请已发出', 'success')
      this.loadCardInfo(openid)
    }, err => {
      wxUtil.showToast(err.errMsg || '操作失败')
    })
  },
})
