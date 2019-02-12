import wxUtil from '../../utils/wxUtil'

Page({
  data: {
    friendList: [
      {
        ID: 'string',
        head_url: 'string',
        real_name: 'string',
        school: 'string',
        department: 'string',
        location: 'string',
        company: 'string',
        job: 'string',
      }
    ],
  },
  onReachBottom() {},
  handleClickCard() {
    wxUtil.navigateTo('detail')
  },
})
