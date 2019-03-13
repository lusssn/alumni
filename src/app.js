const qcloud = require('./vendor/wafer2-client-sdk/index')
import config from './config'

App({
  onLaunch() {
    qcloud.setLoginUrl(config.service.loginUrl)
  },
  global: {},
  setConfig(conf) {
    Object.assign(this.global, conf)
  },
})
