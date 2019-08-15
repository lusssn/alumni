/**
 * 小程序配置文件
 */
const HOST = {
  online: 'https://www.seuclab.cn',
  dev: 'https://www.seuclab.cn',
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
  },
}

export default server
