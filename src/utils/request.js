import server from '../server'
import { promisify } from './util'
import * as Error from '../error'

const regHttp = /^(http[s]{0,1}:\/\/)/

const request = (url, params = {}, others = {}) => {
  const _url = `${regHttp.test(url) ? '' : server.host}${url}`
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
    if (+data.status === 200 || data.status === 0) {
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
  return request(url, params, {
    method: 'GET',
    ...custom,
  })
}

const post = (url, params = {}, custom = {}) => {
  return request(url, params, {
    method: 'POST',
    ...custom,
  })
}

const del = (url, params = {}, custom = {}) => {
  return request(url, params, {
    method: 'DELETE',
    ...custom,
  })
}

const put = (url, params = {}, custom = {}) => {
  return request(url, params, {
    method: 'PUT',
    ...custom,
  })
}

export default {
  get,
  post,
  del,
  put,
}
