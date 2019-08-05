/**
 * 小程序配置文件
 */

const HOST = {
  online: 'https://www.seuclab.cn',
  dev: 'http://wangq.fun:18080',
}

// 此处主机域名修改成腾讯云解决方案分配的域名
const host = HOST.dev
const qqMapHost = 'https://apis.map.qq.com'

const server = {
  qqMapKey: 'AWIBZ-EZJ34-AULUQ-DO546-YFS5T-6ZFNX',
  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    qqMapHost,
    // 接口请求地址
    baseUrl: `${host}/weapp`,

    // 登录地址，用于建立会话
    loginUrl: `https://www.seuclab.cn/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,
  },
}

export default server
