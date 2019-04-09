import wxUtil from '../../utils/wxUtil'
import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { CONTACT_TYPE } from '../../macro'

Page({
  data: {
    basic: {},
    educations: [],
    works: [],
    status: '',
  },
  onLoad({ id }) {
    if (!id) {
      wxUtil.showToast('不存在此人')
      return
    }
    // 加载详情数据
    Api.getCardInfo({ cardid: id }).then(data => {
      const { personalinfor, personal, education, work, state } = data
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
    const { basic } = this.data
    Api.getAcceptFriend({ friendid: basic.id }).then(() => {
    }, () => {})
  },
  handleRefuse() {
    const { basic } = this.data
    Api.getRefuseFriend({ friendid: basic.id }).then(() => {
    }, () => {})
  },
  handleApplyExchange() {
    const { basic } = this.data
    Api.getInviteFriend({ friendid: basic.id }).then(() => {
    }, () => {})
  },
})
