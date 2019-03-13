const qcloud = require('../vendor/wafer2-client-sdk/index')
import config from '../config'
import { promisifyWxApi } from './util'
import wxUtil from './wxUtil'

const app = getApp()

const getUserInfo = () => {
  // 优先从global中读取数据
  const { userInfo } = app.global
  if (userInfo) {
    return Promise.resolve(userInfo)
  }
  const session = qcloud.Session.get()
  if (session) {
    // 如果有session，则使用code登录
    return promisifyWxApi(qcloud.loginWithCode)()
      .then(res => {
        // 将个人信息存储到global
        app.setConfig({ userInfo: res })
        return res
      })
  } else {
    // 无session情况下的登录
    // 需要先判断是否授权
    return promisifyWxApi(wx.getSetting)()
      .then(
        ({ authSetting }) => {
          if (authSetting['scope.userInfo']) {
            // 进行登录
            return promisifyWxApi(qcloud.login)()
              .then(res => {
                // 将个人信息存储到global
                app.setConfig({ userInfo: res })
                return res
              })
          }
          return Promise.reject({
            title: '未进行授权',
            code: -1,
          })
        }, () => {
          return Promise.reject({
            title: '获取授权失败',
            code: -1,
          })
        },
      )
  }
}

const _request = (url, params = {}, others) => {
  return promisifyWxApi(qcloud.request)({
    url,
    data: params,
    ...others,
  }).then(res => {
    if (res.statusCode === 200) {
      return res.data
    }
    return Promise.reject({
      title: '请求失败',
      code: -1,
    })
  }).then(data => {
    if (+data.status === 200) {
      return data
    }
    return Promise.reject({
      title: data.message,
      code: data.status,
    })
  }).catch(err => {
    wxUtil.showToast(err.title)
    return Promise.reject(err)
  })
}

const get = (url, params = {}, others) => {
  const _url = `${config.service.baseUrl}${url}`
  return _request(_url, params, {
    method: 'GET',
    ...others,
  })
}

const post = (url, params = {}, others) => {
  const _url = `${config.service.baseUrl}${url}`
  return _request(_url, params, {
    method: 'POST',
    ...others,
  })
}

export default {
  getUserInfo,
  get,
  post,
}
