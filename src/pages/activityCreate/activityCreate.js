import * as Util from '../../utils/util'

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
  handleSubmit() {
    console.log(this.data.info)
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
