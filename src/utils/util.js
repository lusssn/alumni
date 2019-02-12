/**
 * 将大多数微信接口转换成promise形式
 * 配置项中的success和fail回调会失效
 * complete回调用finally处理
 * @param fn
 * @returns {Function}
 */
export const promisifyWxApi = fn => {
  return args => {
    return new Promise((resolve, reject) => {
      fn({
        ...args,
        success: res => resolve(res),
        fail: res => reject(res)
      })
    })
  }
}
