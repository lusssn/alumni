import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'
import { CONTACT_TYPE } from '../../macro'
import * as R from '../../utils/ramda/index'

Page({
  data: {
    basic: {},
    educations: [],
    works: [],
    status: '',
  },
  onLoad({ id, status = 0 }) {
    if (!id) {
      wxUtil.showToast('不存在此人')
      return
    }
    // 加载详情数据
    request.getUserInfo().then(({ openId }) => {
      request.get(`card/readcard/${openId}/${id}`).then(({ data }) => {
        const { base, personal, education, work } = data
        const contactType = R.find(R.propEq('id', +status))(CONTACT_TYPE)
        this.setData({
          basic: { ...base[0], ...personal[0] },
          educations: education,
          works: work,
          status: contactType.key,
        })
      }, () => {
        wxUtil.showToast('获取详情失败')
      })
    })
  },
  handleAccept() {
    const { basic } = this.data
    request.getUserInfo().then(({ openId }) => {
      request.get(`/friend/accept/${openId}/${basic.id}`).then(() => {
      }, () => {})
    })
  },
  handleRefuse() {
    const { basic } = this.data
    request.getUserInfo().then(({ openId }) => {
      request.get(`/friend/refuse/${openId}/${basic.id}`).then(() => {
      }, () => {})
    })
  },
  handleApplyExchange() {
    const { basic } = this.data
    request.getUserInfo().then(({ openId }) => {
      request.get(`/friend/invite/${openId}/${basic.id}`).then(() => {
      }, () => {})
    })
  }
})
