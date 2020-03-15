import server from '../server'
import { promisify } from './util'
import * as Error from '../error'
import wxUtil from './wxUtil'

const regHttp = /^(http[s]{0,1}:\/\/)/
const app = getApp()


function handleResponse(response) {
  return new Promise((resolve, reject) => {
    if (response.statusCode === 200) {
      if (typeof response.data === 'string') {
        return resolve(JSON.parse(response.data))
      }
      return resolve(response.data)
    }
    return reject(Error.RESPONSE_ERROR)
  }).then(data => {
    const { status = -1, message = '服务暂不可用' } = data
    // 特殊说明：qqMap接口返回的status为0时为成功
    if (status === 200 || status === 0) {
      return data
    }
    // 登录失效，重新登录
    if (status === Error.INVALID_.errCode) {
      return wxUtil.login({ isForceUpdate: true }).then(
        () => request(url, params, others),
        err => Promise.reject(err),
      )
    }
    return Promise.reject({
      errMsg: message,
      errCode: status,
    })
  }).catch(err => {
    return Promise.reject(err)
  })
}

const request = (url, params = {}, others = {}) => {
  const { header = {}, ...other } = others
  header['X-Wx-Token'] = app.global.token || ''

  const _url = `${regHttp.test(url) ? '' : server.host}${url}`

  return promisify(wx.request)({
    url: _url,
    data: params,
    header,
    ...other,
  }).then(handleResponse)
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

const upload = (url, file, params = {}) => {
  const _url = `${regHttp.test(url) ? '' : server.host}${url}`
  return promisify(wx.uploadFile)({
    url: _url,
    filePath: file,
    formData: params,
    name: 'file',
    header: {
      'X-Wx-Token': app.global.token || '',
    },
  }).then(handleResponse)
}

export default {
  get,
  post,
  del,
  put,
  upload,
}
