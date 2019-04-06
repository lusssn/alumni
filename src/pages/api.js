import request from '../utils/request'

// 搜索-搜索列表
export const fetchSearch = params =>
  request.get('/search/searchdirect', { ...params }, {
    noAuth: true,
  }).then(res => res.data)

// 搜索-搜索结果列表
export const fetchSearchResult = params =>
  request.get('/search/search', { ...params }, {
    noAuth: true,
  }).then(res => res.data)

// 我的-获取所有名片信息
export const fetchAllInfo = () =>
  request.get('/query/getall').then(res => res.data)

// 我的-获取名片基本信息
export const fetchBasicInfo = () =>
  request.get('/query/getbase').then(res => res.data)

// 我的-获取名片教育信息
export const fetchEducationInfo = () =>
  request.get('/query/geteducation').then(res => res.data)

// 我的-获取名片工作信息
export const fetchWorkInfo = () =>
  request.get('/query/getwork').then(res => res.data)


// 朋友-获取通知列表
export const fetchNoticeList = params =>
  request.get('/friend/getinform', { ...params }).then(res => res.data)

// 朋友-获取朋友列表
export const fetchFriendList = params =>
  request.get('/friend/getfriend', { ...params }).then(res => res.data)


// 编辑-保存基本信息
export const fetchSaveBasic = params =>
  request.post('/edit/editbase', { ...params })

// 编辑-保存教育信息
export const fetchSaveEducation = params =>
  request.post('/edit/editeducation', { ...params })

// 编辑-删除教育信息
export const fetchRemoveEducation = params =>
  request.post('/edit/deleteeducation', { ...params })

// 编辑-保存工作信息
export const fetchSaveWork = params =>
  request.post('/edit/editwork', { ...params })

// 编辑-删除工作信息
export const fetchRemoveWork = params =>
  request.post('/edit/deletework', { ...params })


// 详情-名片详情
export const fetchCardInfo = params =>
  request.get('/card/readcard', { ...params }).then(res => res.data)

// 详情-同意交换名片
export const fetchAcceptFriend = params =>
  request.get('/friend/accept', { ...params })

// 详情-拒绝交换名片
export const fetchRefuseFriend = params =>
  request.get('/friend/refuse', { ...params })

// 详情-请求交换名片
export const fetchInviteFriend = params =>
  request.get('/friend/invite', { ...params })
