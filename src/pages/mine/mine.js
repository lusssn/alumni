import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  data: {
    isLoaded: false,
    basic: {},
    educations: [],
    works: [],
  },
  onLoad() {
    request.getUserInfo().then(({ openId }) => {
      request.get(`/query/getall/${openId}`).then(({ data }) => {
        const { base, personal, education, work } = data
        this.setData({
          isLoaded: true,
          basic: { ...base[0], ...personal[0] },
          educations: education,
          works: work,
        })
      }, () => {})
    })
  },
  onShow() {
    const app = getApp()
    app.checkNotice('editedBasic', true, this.updateBasic)
    app.checkNotice('editedEducation', true, this.updateEducation)
    app.checkNotice('editedWork', true, this.updateWork)
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
  },
  updateBasic() {
    request.getUserInfo().then(({ openId }) => {
      request.get(`/query/getbase/${openId}`).then(({ data }) => {
        const { base, personal } = data
        this.setData({
          basic: { ...base[0], ...personal[0] },
        })
      }, () => {})
    })
  },
  updateEducation() {
    request.getUserInfo().then(({ openId }) => {
      request.get(`/query/geteducation/${openId}`).then(({ data }) => {
        this.setData({ educations: data })
      }, () => {})
    })
  },
  updateWork() {
    request.getUserInfo().then(({ openId }) => {
      request.get(`/query/getwork/${openId}`).then(({ data }) => {
        this.setData({ works: data })
      }, () => {})
    })
  },
})
