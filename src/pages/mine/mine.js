import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  data: {
    education: [],
  },
  onLoad() {
    request.getUserInfo().then(({ openId }) => {
      request.get(`/query/getall/${openId}`).then(({ data }) => {
        this.setData( data )
      }, () => {})
    })
  },
  handleBasicEdit() {
    wxUtil.navigateTo('edit', { type: 'basic' })
  },
  handleEducationAdd() {
    wxUtil.navigateTo('edit', { type: 'education' })
  },
  handleJobAdd() {
    wxUtil.navigateTo('edit', { type: 'job' })
  }
})
