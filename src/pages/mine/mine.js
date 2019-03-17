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
  handleEducationAdd(e) {
    const { num } = e.currentTarget.dataset
    wxUtil.navigateTo('edit', {
      type: 'education',
      id: num,
    })
  },
  handleWorkAdd(e) {
    const { num } = e.currentTarget.dataset
    wxUtil.navigateTo('edit', {
      type: 'work',
      id: num,
    })
  }
})
