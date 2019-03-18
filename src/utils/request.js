const qcloud = require('../vendor/wafer2-client-sdk/index')
import config from '../config'
import { promisifyWxApi } from './util'
import wxUtil from './wxUtil'

const app = getApp()
const regHttp = /^(http[s]{0,1}:\/\/)/

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
  const _url = `${regHttp.test(url) ? '' : config.service.baseUrl}${url}`
  return promisifyWxApi(qcloud.request)({
    url: _url,
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
    // 特殊说明：qqMap接口返回的status为0时为成功
    if (+data.status === 200 || !data.status) {
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

const get = (url, params = {}, others = {}) => {
  return _request(url, params, {
    method: 'GET',
    ...others,
  })
}

const post = (url, params = {}, { header = {}, ...others } = {}) => {
  const _header = {
    'content-type': 'application/x-www-form-urlencoded',
    ...header,
  }
  return _request(url, params, {
    method: 'POST',
    header: _header,
    ...others,
  })
}

const getLocation = () => {
  return promisifyWxApi(wx.getLocation)({
    type: 'wgs84',
  }).then(({ latitude, longitude }) => {
    const _url = `${config.service.qqMapHost}/ws/geocoder/v1/`
    return get(_url, {
      location: `${latitude},${longitude}`,
      key: config.qqMapKey,
    }).then((res) => {
      const { address_component: address } = res.result
      return address.city || address.province || address.nation
    })
  }, () => {
    return Promise.reject({
      title: '获取位置失败',
      code: -1,
    })
  })
}

export default {
  getLocation,
  getUserInfo,
  get,
  post,
}
