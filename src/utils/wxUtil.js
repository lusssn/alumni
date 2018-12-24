// 需要手动配置tabbar页面列表
const TABBAR_PAGES = ['index', 'friend', 'mine']
/**
 * Toast提示重载
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

export default {
  navigateTo,
}
