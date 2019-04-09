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
  return Api.getAllInfo().then(data => {
    const { base, education, work } = data
    console.log(base, education, work)
    // 姓名、个人描述、学校名称、公司
    return (!R.isEmpty(base) && !R.isEmpty(education) && !R.isEmpty(work) &&
      !!base[0].real_name && !!base[0].descr && !!education[0].school && !!work[0].company)
  }, err => {
    if (err.errCode === Error.UNAUTHORIZED.errCode) {
      console.log('未授权')
      wxUtil.navigateTo('complete', {}, 'all')
    }
  })
}
