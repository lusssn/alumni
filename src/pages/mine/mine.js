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
        const { base, personal, education, work } = data
        this.setData({
          basic: { ...base[0], ...personal[0] },
          educations: education,
          works: work,
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
