import moment from './moment.min'
import * as R from './ramda/index'
import wxUtil from './wxUtil'

const app = getApp()

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

export const getYear = timestamp => {
  if (isNaN(timestamp) || !timestamp) {
    return ''
  }
  return moment(timestamp).format('YYYY')
}

export const getYearMonthDate = timestamp => {
  if (isNaN(timestamp) || !timestamp) {
    return ''
  }
  return moment(timestamp).format('YYYY-MM-DD')
}

export const isRegistered = () => {
  const { registered, step1Finished } = app.global
  if (registered && step1Finished) {
    return true
  }
  const { route, options } = getCurrentPages().pop()
  let targetPage
  if (!step1Finished) {
    targetPage = 'register'
  } else {
    targetPage = 'complete'
  }
  wxUtil.navigateTo(targetPage, {
    redirect: route.split('/')[1],
    options: JSON.stringify(options),
  }, true)
  return false
}

export const checkParams = (checkList, params) => {
  const _params = R.clone(params)
  for (let field of checkList) {
    const { prop } = field
    // _params[prop]可以为0
    if (field.isMust && (_params[prop] === '' || _params[prop] === undefined)) {
      wxUtil.showToast(`${field.name}必填`)
      return {}
    }
    if (_params[prop] === '' || _params[prop] === undefined) {
      _params[prop] = field.defaultValue
    }
    // 处理时间类型的参数
    if (field.type === 'date') {
      _params[prop] = moment(_params[prop], field.format).valueOf()
    }
  }
  return _params
}

export const getSortQuery = dict => {
  let str = ''

  for (let key of Object.keys(dict)) {
    if (key) {
      str = `${str}&${key}=${encodeURIComponent(dict[key])}`
    }
  }
  return str.substr(1)
}
