/* 前端错误码，为负数 */
export const UNAUTHORIZED = { errMsg: '未进行授权', errCode: -101 }
export const AUTH_FAILED = { errMsg: '获取授权失败', errCode: -102 }
export const LOGIN_FAILED = { errMsg: '登录失败', errCode: -103 }

export const RESPONSE_ERROR = { errMsg: '响应失败', errCode: -201 }

export const LOCATION_FAILED = { errMsg: '获取位置失败', errCode: -301 }

/* 后端错误码，为正数 */
export const INVALID_TOKEN = { errMsg: '登录失效', errCode: 401 }
