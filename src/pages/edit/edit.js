import * as R from '../../utils/ramda/index'

const EDIT_TYPE = [
  { type: 'basic', title: '编辑基本信息' },
  { type: 'education', title: '添加教育经历' },
  { type: 'job', title: '添加工作经历' },
]
Page({
  data: {
    type: '',
    degreeSelect: [
      { id: 5, name: '专科' },
      { id: 4, name: '本科' },
      { id: 3, name: '硕士' },
      { id: 2, name: '博士' },
      { id: 1, name: '其他' },
    ],
    basic: {
      gender: 1,
    },
    education: {},
  },
  onLoad({ type }) {
    const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
    wx.setNavigationBarTitle({
      title: editType.title,
    })
    this.setData({ type })
  },
  handleClickAvatar() {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.setData({
          'basic.avatar': res.tempFilePaths.pop(),
        })
      },
    })
  },
  handleInputChange(e) {
    const { type } = this.data
    const { name } = e.currentTarget.dataset
    this.setData({
      [`${type}.${name}`]: e.detail.value,
    })
  },
  handleDegreeChange(e) {
    this.setData({
      'education.degree': e.detail.value,
    })
  },
  handleClickSave() {
    console.log(this.data[this.data.type])
  },
})
