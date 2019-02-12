import * as R from '../../utils/ramda/index'
import { promisifyWxApi } from '../../utils/util'

const EDIT_TYPE = [
  { type: 'basic', title: '编辑基本信息' },
  { type: 'education', title: '添加教育经历' },
  { type: 'job', title: '添加工作经历' },
]

Page({
  data: {
    type: '', // 当前编辑的信息类型
    id: null, // 若不为null，表示为编辑状态
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
  onLoad({ type, id = null }) {
    const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
    wx.setNavigationBarTitle({
      title: editType.title,
    })
    this.setData({ type, id })
  },
  handleClickAvatar() {
    promisifyWxApi(wx.chooseImage)({
      count: 1,
    }).then(res => {
      this.setData({
        'basic.avatar': res.tempFilePaths.pop(),
      })
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
  handleRemove() {
    promisifyWxApi(wx.showModal)({
      title: '提示',
      content: '你确认要删除该条信息吗？',
      confirmColor: '#2180E8',
    }).then(({ confirm }) => {
      confirm && wx.navigateBack()
    })
  },
  handleSave() {
    console.log(this.data[this.data.type])
  },
})
