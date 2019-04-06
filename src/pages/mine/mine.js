import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

Page({
  data: {
    isLoaded: false,
    basic: {},
    educations: [],
    works: [],
  },
  onLoad() {
    Api.fetchAllInfo().then(data => {
      const { base, personal, education, work } = data
      this.setData({
        isLoaded: true,
        basic: { ...base[0], ...personal[0] },
        educations: education,
        works: work,
      })
    }, () => {})
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
    Api.fetchBasicInfo().then(data => {
      const { base, personal } = data
      this.setData({
        basic: { ...base[0], ...personal[0] },
      })
    }, () => {})
  },
  updateEducation() {
    Api.fetchEducationInfo().then(data => {
      this.setData({ educations: data })
    }, () => {})
  },
  updateWork() {
    Api.fetchWorkInfo().then(({ data }) => {
      this.setData({ works: data })
    }, () => {})
  },
})
