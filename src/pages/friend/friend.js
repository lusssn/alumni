import wxUtil from '../../utils/wxUtil'

Page({
  data: {
    friendList: [
      {
        ID: 'string',
        head_url: 'string',
        real_name: 'string',
        location: 'string',
        company: 'string',
        job: 'string',
      },
      {
        ID: 'string',
        head_url: 'string',
        real_name: 'string',
        location: 'string',
        company: 'string',
        job: 'string',
      },
    ],
  },
  handleClickCard() {
    wxUtil.navigateTo('detail')
  },
  handleToNotice() {
    wxUtil.navigateTo('notice')
  },
})
