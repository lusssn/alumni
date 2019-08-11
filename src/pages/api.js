import request from '../utils/request'
import _request from '../utils/_request'

/*************************************** 注册 ***************************************/
export const createAccount = params =>
  _request.post('/v2/account/create', params)

/*************************************** 圈子 ***************************************/
// 首页-名片广场
export const getSquareCards = params =>
  _request.get('/v2/recommand', params).then(res => res.data)

// 搜索-搜索列表
export const getSearch = params =>
  _request.get('/v2/query', params).then(res => res.data)

// 搜索-搜索结果列表
export const getSearchResult = params =>
  request.get('/search/search', params, {
    noAuth: true,
  }).then(res => res.data)

/*************************************** 我的 ***************************************/
// 我的-获取名片全部信息
export const getAccountAll = params =>
  _request.get('/v2/accountAll', params).then(res => res.data)

// 我的-获取名片信息
export const getAccount = params =>
  _request.get('/v2/account', params).then(res => res.data)

// 我的-获取名片教育信息
export const getEducationInfo = params =>
  _request.get('/v2/education', params).then(res => res.data)

// 我的-获取名片工作信息
export const getWorkInfo = params =>
  _request.get('/v2/job', params).then(res => res.data)

/*************************************** 朋友 ***************************************/
// 朋友-获取通知列表
export const getNoticeList = params =>
  _request.get('/v2/message', params).then(res => res.data)

// 朋友-获取朋友列表
export const getFriendList = params =>
  _request.get('/v2/friends', params).then(res => res.data)

// 完善-保存名片信息
export const completeCard = params =>
  _request.put('/v2/account/complete', params)

/************************************ 编辑、完善 *************************************/
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

/************************************* 名片详情 *************************************/
// 详情-同意交换名片
export const getAcceptFriend = params =>
  _request.post('/v2/friend/manage', { action: 1, ...params })

// 详情-拒绝交换名片
export const getRefuseFriend = params =>
  _request.post('/v2/friend/manage', { action: 0, ...params })

// 详情-请求交换名片
export const getInviteFriend = params =>
  _request.post('/v2/friend/apply', params)
