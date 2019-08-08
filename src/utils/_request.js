import server from '../server'
import { promisify } from './util'
import * as Error from '../error'

const app = getApp()
const regHttp = /^(http[s]{0,1}:\/\/)/

const getUserInfo = () => {
  // 优先从global中读取数据
  const { userInfo } = app.global
  if (userInfo) {
    return Promise.resolve(userInfo)
  }
  return promisify(wx.login)().then(
    ({ code }) => {
      if (code) {
        return get('/v2/wechat/code2Session', {
          js_code: code,
        }).then(
          res => {
            // 需要先判断是否授权
            return promisify(wx.getSetting)().then(
              ({ authSetting }) => {
                if (authSetting['scope.userInfo']) {
                  return promisify(wx.getUserInfo)().then(
                    ({ userInfo }) => {
                      // 将个人信息存储到global
                      const userInfoTemp = {
                        ...userInfo,
                        accountId: res.data,
                      }
                      app.setConfig({ userInfo: userInfoTemp })
                      return userInfoTemp
                    },
                    () => Promise.reject(Error.AUTH_FAILED),
                  )
                }
                return Promise.reject(Error.UNAUTHORIZED)
              },
              () => Promise.reject(Error.AUTH_FAILED),
            )
          },
          () => Promise.reject(Error.RESPONSE_ERROR),
        )
      }
    },
    () => Promise.reject(Error.LOGIN_FAILED),
  )
}

const _request = (url, params = {}, others = {}) => {
  const _url = `${regHttp.test(url) ? '' : server.service.host}${url}`
  return promisify(wx.request)({
    url: _url,
    data: params,
    ...others,
  }).then(res => {
    if (res.statusCode === 200) {
      return res.data
    }
    return Promise.reject(Error.RESPONSE_ERROR)
  }).then(data => {
    // 特殊说明：qqMap接口返回的status为0时为成功
    // -1：已注册
    if (+data.status === 200 || data.status === 0 || data.status === -1) {
      return data
    }
    return Promise.reject({
      errMsg: data.message || '服务暂不可用',
      errCode: data.status || -1,
    })
  }).catch(err => {
    return Promise.reject(err)
  })
}

const get = (url, params = {}, custom = {}) => {
  return _request(url, params, {
    method: 'GET',
    ...custom,
  })
}

const post = (url, params = {}, custom = {}) => {
  return _request(url, params, {
    method: 'POST',
    ...custom,
  })
}

const getLocation = () => {
  return promisify(wx.getLocation)({
    type: 'wgs84',
  }).then(({ latitude, longitude }) => {
    const url = `${server.service.qqMapHost}/ws/geocoder/v1/`
    const params = {
      location: `${latitude},${longitude}`,
      key: server.qqMapKey,
    }
    return get(url, params).then((res) => {
      const { address_component: address } = res.result
      return address.city || address.province || address.nation
    }, (err) => {
      return Promise.reject(err)
    })
  }, err => {
    return Promise.reject(err.errMsg ? err : Error.LOCATION_FAILED)
  })
}

export default {
  getLocation,
  getUserInfo,
  get,
  post,
}
