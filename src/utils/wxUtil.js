import { promisify, isRegistered } from './util'
import * as Error from '../error'
import * as Api from '../pages/api'

const app = getApp()

const login = ({ isForceUpdate } = {}) => {
  // 优先从global中读取数据
  const { accountId } = app.global
  if (!isForceUpdate && accountId) {
    return Promise.resolve(true)
  }
  return promisify(wx.login)().then(
    ({ code }) => {
      if (code) {
        return Api.login({ js_code: code }).then(
          data => {
            app.setConfig(data)
            return Promise.resolve(isRegistered())
          },
          () => Promise.reject(Error.RESPONSE_ERROR),
        )
      }
    },
    () => Promise.reject(Error.LOGIN_FAILED),
  )
}

const getUserInfo = () => {
  // 优先从global中读取数据
  const { userInfo, accountId } = app.global
  if (userInfo) {
    return Promise.resolve({ userInfo, accountId })
  }
  return login().then(
    () => {
      // 需要先判断是否授权
      return promisify(wx.getSetting)().then(
        ({ authSetting }) => {
          if (authSetting['scope.userInfo']) {
            return promisify(wx.getUserInfo)().then(
              ({ userInfo }) => {
                // 将个人信息存储到global
                app.setConfig({ userInfo })
                return userInfo
              },
              () => Promise.reject(Error.AUTH_FAILED),
            )
          }
          return Promise.reject(Error.UNAUTHORIZED)
        },
        () => Promise.reject(Error.AUTH_FAILED),
      )
    },
    err => Promise.reject(err),
  )
}

const getLocation = () => {
  return promisify(wx.getLocation)({
    type: 'wgs84',
  }).then(({ latitude, longitude }) => {
    return Api.getLocation({
      location: `${latitude},${longitude}`,
    }).then((res) => {
      const { address_component: address } = res.result
      return address.city || address.province || address.nation
    }, (err) => {
      return Promise.reject(err)
    })
  }, err => {
    return Promise.reject(err.errMsg ? err : Error.LOCATION_FAILED)
  })
}

// 需要手动配置tabbar页面列表
const TABBAR_PAGES = ['connections', 'hubs', 'mine']
/**
 * 页面跳转重载
 * @param pageName String 必填，页面文件名称
 * @param urlParams Json 页面参数
 * @param close Boolean/String 跳转方式，true：关闭当前页再跳转；'all'：关闭所有页面再跳转
 */
const navigateTo = (pageName, urlParams, close) => {
  const objParams = {}
  let isTabbarPage = TABBAR_PAGES.indexOf(pageName) !== -1
  let strParams = ''
  for (const key in urlParams) {
    if (!urlParams.hasOwnProperty(key)) {
      continue
    }
    // 对参数做编码，所以如果参数值包含中文，取用时要解码
    strParams += `${key}=${encodeURIComponent(urlParams[key])}&`
  }
  strParams = strParams.replace(/&$/, '')

  objParams.url = `/pages/${pageName}/${pageName}${strParams ? `?${strParams}` : ''}`

  // tabbar页面只能通过reLaunch实现关闭当前页
  if (close === 'all' || (isTabbarPage && close)) {
    wx.reLaunch(objParams)
  } else if (isTabbarPage) {
    wx.switchTab(objParams)
  } else if (close) {
    wx.redirectTo(objParams)
  } else {
    wx.navigateTo(objParams)
  }
}

/**
 * Toast提示重载
 * @param title
 * @param icon
 * @param others
 * @returns { Promise }
 */
const showToast = (title = '', icon = 'warning', others) =>
  new Promise((resolve, reject) => {
    const params = {
      title,
      icon,
      mask: true,
      duration: 1500,
      ...others,
    }
    if (icon === 'warning') {
      params.image = '../../images/warning-o.png'
    }
    promisify(wx.showToast)(params).then(() => {
      setTimeout(resolve, params.duration)
    }, reject)
  })

export default {
  login,
  getUserInfo,
  getLocation,
  navigateTo,
  showToast,
}
