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
    this.loadAllInfo()
  },
  onShow() {
    const app = getApp()
    app.checkNotice('editedBasic', true, this.updateBasic)
    app.checkNotice('editedEducation', true, this.updateEducation)
    app.checkNotice('editedWork', true, this.updateWork)
  },
  onPullDownRefresh() {
    this.loadAllInfo().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  handleBasicEdit() {
    wxUtil.navigateTo('edit', { type: 'basic' })
  },
  handleEducationAdd(e) {
    const { num } = e.currentTarget.dataset
    if (num) {
      wxUtil.navigateTo('edit', {
        type: 'education',
        id: num,
      })
      return
    }
    wxUtil.navigateTo('edit', { type: 'education' })
  },
  handleWorkAdd(e) {
    const { num } = e.currentTarget.dataset
    if (num) {
      wxUtil.navigateTo('edit', {
        type: 'work',
        id: num,
      })
      return
    }
    wxUtil.navigateTo('edit', { type: 'work' })
  },
  loadAllInfo() {
    return Api.getAllInfo().then(data => {
      const { base, personal, education, work } = data
      this.setData({
        isLoaded: true,
        basic: { ...base[0], ...personal[0] },
        educations: education,
        works: work,
      })
    }, () => {})
  },
  updateBasic() {
    Api.getBasicInfo().then(data => {
      const { base, personal } = data
      this.setData({
        basic: { ...base[0], ...personal[0] },
      })
    }, () => {})
  },
  updateEducation() {
    Api.getEducationInfo().then(data => {
      this.setData({ educations: data })
    }, () => {})
  },
  updateWork() {
    Api.getWorkInfo().then(data => {
      this.setData({ works: data })
    }, () => {})
  },
})
