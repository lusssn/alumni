import request from '../utils/request'
import _request from '../utils/_request'

// 首页-名片广场
export const getSquareCards = params =>
  request.get('/home/similar', params).then(res => res.data)

// 搜索-搜索列表
export const getSearch = params =>
  request.get('/search/searchdirect', params, {
    noAuth: true,
  }).then(res => res.data)

// 搜索-搜索结果列表
export const getSearchResult = params =>
  request.get('/search/search', params, {
    noAuth: true,
  }).then(res => res.data)

// 我的-获取名片教育信息
export const getEducationInfo = params =>
  _request.get('/v2/education', params).then(res => res.data)

// 我的-获取名片工作信息
export const getWorkInfo = params =>
  _request.get('/v2/job', params).then(res => res.data)


// 朋友-获取通知列表
export const getNoticeList = params =>
  request.get('/friend/getinform', params).then(res => res.data)

// 朋友-获取朋友列表
export const getFriendList = params =>
  _request.get('/v2/friends', params).then(res => res.data)


// 完善-保存名片信息
export const saveCardInfo = params =>
  request.post('/edit/editfirst', params)

// 编辑-保存基本信息
export const saveBasic = params =>
  _request.post('/v2/account', params)

// 编辑-保存教育信息
export const saveEducation = params =>
  _request.post('/v2/education', params)

// 编辑-删除教育信息
export const removeEducation = params =>
  _request.del('/v2/education', params)

// 编辑-保存工作信息
export const saveWork = params =>
  _request.post('/v2/job', params)

// 编辑-删除工作信息
export const removeWork = params =>
  _request.del('/v2/job', params)


// 详情-名片详情
export const getCardInfo = params =>
  request.get('/card/readcard', params).then(res => res.data)

// 详情-同意交换名片
export const getAcceptFriend = params =>
  request.get('/friend/accept', params)

// 详情-拒绝交换名片
export const getRefuseFriend = params =>
  request.get('/friend/refuse', params)

// 详情-请求交换名片
export const getInviteFriend = params =>
  request.get('/friend/invite', params)

export const createAccount = params =>
  _request.post('/v2/account/create', params)

export const getAccountAll = params =>
  _request.get('/v2/accountAll', params).then(res => res.data)

export const getAccount = params =>
  _request.get('/v2/account', params).then(res => res.data)
