App({
  onLaunch () {},
  config: {},
  setConfig (conf) {
    const self = this
    Object.assign(self.config, conf)
  },
  parseConfig (data) {
    const ret = {}
    if (data.app_token) {
      ret.APP_TOKEN = data.app_token
      ret.TIME_EXPIRE = data.expire
    }
    this.setConfig(ret)
  },
})
