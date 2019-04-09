import { isComplete } from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  data: {
    isLoaded: false,
    friendList: [
      {
        ID: '1',
        head_url: 'string',
        real_name: 'string',
        school: 'string',
        department: 'string',
        location: 'string',
        company: 'string',
        job: 'string',
      },
      {
        ID: '2',
        head_url: 'string',
        real_name: 'string',
        school: 'string',
        department: 'string',
        location: 'string',
        company: 'string',
        job: 'string',
      },
    ],
  },
  onLoad() {
    isComplete().then(res => {
      if (res) {
        this.setData({ isLoaded: true })
        return
      }
      wxUtil.navigateTo('complete', {}, 'all')
    })
  },
  onPullDownRefresh() {},
  onReachBottom() {},
  handleClickSearch() {
    wxUtil.navigateTo('search')
  },
  handleClickCard() {
    wxUtil.navigateTo('detail')
  },
})
