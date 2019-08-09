/**
 * 将大多数微信接口转换成promise形式
 * 配置项中的success和fail回调会失效
 * complete回调用finally处理
 * @param fn
 * @returns {Function}
 */
export const promisify = fn => {
  return args => {
    return new Promise((resolve, reject) => {
      fn({
        ...args,
        success: res => resolve(res),
        fail: res => reject(res),
      })
    })
  }
}

import * as Api from '../pages/api'
import * as Error from '../error'
import * as R from './ramda/index'
import wxUtil from './wxUtil'

export const isComplete = () => {
  // 是否授权
  // 获取基本信息，判断信息是否完善
  return Api.getAccountAll({
    accountId: getApp().global.accountId,
  }).then(data => {
    const { base, personal, education } = data
    if (R.isEmpty(base) || R.isEmpty(personal) || R.isEmpty(education)) {
      return false
    }
    // 手机号、学校名称、院系
    const _education = education[0]
    if (!personal[0].phone || !_education.school || !_education.department) {
      return false
    }
    // 姓名、个人描述、定位
    const basic = base[0]
    return !!basic.real_name && !!basic.descr && !!basic.city
  }, err => {
    if (err.errCode === Error.UNAUTHORIZED.errCode) {
      wxUtil.navigateTo('complete', {}, 'all')
    }
  })
}
