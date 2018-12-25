import * as R from '../../utils/ramda/index'

const EDIT_TYPE = [
  { type: 'basic', title: '编辑基本信息' },
  { type: 'education', title: '添加教育经历' },
  { type: 'job', title: '添加工作经历' },
]
Page({
  data: {
    type: '',
  },
  onLoad({ type }) {
    const editType = R.find(R.propEq('type', type))(EDIT_TYPE)
    wx.setNavigationBarTitle({
      title: editType.title,
    })
    this.setData({ type })
  },
})
