import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  data: {
    basic: {},
    educations: [],
    works: [],
  },
  onLoad() {
    request.getUserInfo().then(({ openId }) => {
      request.get(`/query/getall/${openId}`).then(({ data }) => {
        const { base, personal } = data
        this.setData({
          basic: { ...base[0], ...personal[0] },
          educations: data.education,
          works: data.work,
        })
      }, () => {})
    })
  },
  handleBasicEdit() {
    wxUtil.navigateTo('edit', { type: 'basic' })
  },
  handleEducationAdd() {
    wxUtil.navigateTo('edit', { type: 'education' })
  },
  handleWorkAdd() {
    wxUtil.navigateTo('edit', { type: 'job' })
  }
})
