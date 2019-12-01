import * as Util from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import * as Api from  '../api'
import moment from '../../utils/moment.min'

const app = getApp()

Page({
  data: {
    MAX_IMAGE_AMOUNT: 6,
    info: {
      activityName: '',
      activityDesc: '',
      activityTime: '',
      expirationTime: '',
    },
    images: [],
  },
  onLoad() {
    wxUtil.login()
  },
  handleSubmit() {
    const { info } = this.data
    const { accountId } = app.global
    Api.createActivity({
      accountId,
      alumniCircleId: 71101,
      activityName: info.activityName,
      activityDesc: info.activityDesc,
      activityTime: moment(info.activityTime).format('YYYY-MM-DD HH:mm:ss'),
      expirationTime: moment(info.expirationTime).format('YYYY-MM-DD HH:mm:ss'),
    }).then(
      () => {},
      () => {},
    )
  },
  handleInputChange(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      [name]: event.detail.value,
    })
  },
  handleRemoveImage(event) {
    const { index } = event.target.dataset
    const images = [...this.data.images]
    images.splice(index, 1)
    this.setData({ images })
  },
  handleChooseImage() {
    const { images } = this.data
    const amount = this.data.MAX_IMAGE_AMOUNT - this.data.images.length
    Util.promisify(wx.chooseImage)({
      count: amount,
    }).then(res => {
      this.setData({
        images: images.concat(res.tempFilePaths),
      })
    })
  },
})
