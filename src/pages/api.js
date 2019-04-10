import request from '../utils/request'

// 首页-名片广场
export const getSquareCards = params =>
  request.get('/home/similar', { ...params }).then(res => res.data)

// 搜索-搜索列表
export const getSearch = params =>
  request.get('/search/searchdirect', { ...params }, {
    noAuth: true,
  }).then(res => res.data)

// 搜索-搜索结果列表
export const getSearchResult = params =>
  request.get('/search/search', { ...params }, {
    noAuth: true,
  }).then(res => res.data)


// 我的-获取所有名片信息
export const getAllInfo = () =>
  request.get('/query/getall').then(res => res.data)

// 我的-获取名片基本信息
export const getBasicInfo = () =>
  request.get('/query/getbase').then(res => res.data)

// 我的-获取名片教育信息
export const getEducationInfo = () =>
  request.get('/query/geteducation').then(res => res.data)

// 我的-获取名片工作信息
export const getWorkInfo = () =>
  request.get('/query/getwork').then(res => res.data)


// 朋友-获取通知列表
export const getNoticeList = params =>
  request.get('/friend/getinform', { ...params }).then(res => res.data)

// 朋友-获取朋友列表
export const getFriendList = params =>
  request.get('/friend/getfriend', { ...params }).then(res => res.data)


// 编辑-保存基本信息
export const getSaveBasic = params =>
  request.post('/edit/editbase', { ...params })

// 编辑-保存教育信息
export const getSaveEducation = params =>
  request.post('/edit/editeducation', { ...params })

// 编辑-删除教育信息
export const getRemoveEducation = params =>
  request.post('/edit/deleteeducation', { ...params })

// 编辑-保存工作信息
export const getSaveWork = params =>
  request.post('/edit/editwork', { ...params })

// 编辑-删除工作信息
export const getRemoveWork = params =>
  request.post('/edit/deletework', { ...params })


// 详情-名片详情
export const getCardInfo = params =>
  request.get('/card/readcard', { ...params }).then(res => res.data)

// 详情-同意交换名片
export const getAcceptFriend = params =>
  request.get('/friend/accept', { ...params })

// 详情-拒绝交换名片
export const getRefuseFriend = params =>
  request.get('/friend/refuse', { ...params })

// 详情-请求交换名片
export const getInviteFriend = params =>
  request.get('/friend/invite', { ...params })
