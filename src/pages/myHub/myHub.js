import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

const app = getApp()

const PAGE_SIZE = 10

Page({
  data: {
    alumniList: [
      {
        "alumniCircleMembersNum": 1,
        "alumniCircleId": 222,
        "creatorId": 3245005322240,
        "alumniCircleType": 2,
        "alumniCircleName": "第二个群组",
        "alumniCircleDesc": "这是第二个用以测试的群组。",
        "avatar": null,
        "authorizationStatus": false,
        "creatorName": "杨诗月"
      },
      {
        "alumniCircleMembersNum": 1,
        "alumniCircleId": 222,
        "creatorId": 3245005322240,
        "alumniCircleType": 2,
        "alumniCircleName": "第二个群组",
        "alumniCircleDesc": "这是第二个用以测试的群组。",
        "avatar": null,
        "authorizationStatus": false,
        "creatorName": "杨诗月"
      },
      {
        "alumniCircleMembersNum": 1,
        "alumniCircleId": 222,
        "creatorId": 3245005322240,
        "alumniCircleType": 2,
        "alumniCircleName": "第二个群组",
        "alumniCircleDesc": "这是第二个用以测试的群组。",
        "avatar": null,
        "authorizationStatus": false,
        "creatorName": "杨诗月"
      }
    ],
    messagePagination: { current: 1, total: 0 },
  },
})
