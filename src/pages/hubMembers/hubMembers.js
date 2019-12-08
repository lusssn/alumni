import * as Api from '../api'

Page({
  data: {
    list: [],
  },
  // 71101
  loadHubMembers() {
    return Api.getHubMembers({

    }).then(
      res => {},
      () => {}
    )
  }
})
