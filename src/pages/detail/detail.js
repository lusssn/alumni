import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  data: {
    basic: {},
    educations: [],
    works: [],
  },
  onLoad({ id }) {
    if (!id) {
      wxUtil.showToast('不存在此人')
      return
    }
    // 加载详情数据
    request.get(`/query/getall/${id}`).then(({ data }) => {
      const { base, personal, education, work } = data
      this.setData({
        basic: { ...base[0], ...personal[0] },
        educations: education,
        works: work,
      })
    }, () => {
      wxUtil.showToast('获取详情失败')
    })
  }
})
