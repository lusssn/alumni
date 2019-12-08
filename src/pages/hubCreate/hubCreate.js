import * as Util from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import * as Api from  '../api'
import moment from '../../utils/moment.min'

const app = getApp()

Page({
  data: {
    MAX_IMAGE_AMOUNT: 1,
    info: {
      name: '',
      desc: '',
      announce: '',
    },
    images: [],
  },
  onLoad({ hub }) {
    wxUtil.login().then(() => {
      if (hub) {
        Api.getHubInfo({ alumniCircleId: hub }).then(
          res => {
            this.setData({
              info: {
                id: res.alumniCircleId,
                name: res.alumniCircleName,
                desc: res.alumniCircleDesc,
                announce: '',
              },
            })
          },
          () => {
            wxUtil.showToast('获取详情失败')
          },
        )
      }
    })
  },
  handleSubmit() {
    const { info } = this.data
    // TODO 待联调
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
