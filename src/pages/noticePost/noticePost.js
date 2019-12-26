import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

Page({
  data: {
    title: '',
    content: '',
  },
  handleSubmit() {
    const { title, content } = this.data
    if (!title) {
      wxUtil.showToast('通知主题必填')
      return
    }
    if (!content) {
      wxUtil.showToast('通知内容必填')
      return
    }
    const currentPage = getCurrentPages().pop()
    wxUtil.login().then(() => {
      Api.batchSendNotice({
        activityId: currentPage.options.activityId,
        title,
        content,
      }).then(() => {
        wxUtil.showToast('发送成功', 'success')
        setTimeout(() => {
          wx.navigateBack()
        }, 1500);
      }, err => {
        wxUtil.showToast(err.errMsg, 'none')
      })
    })
  },
  handleInputChange(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      [name]: event.detail.value,
    })
  },
})
