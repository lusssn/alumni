import * as Util from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import moment from '../../utils/moment.min'

Page({
  data: {
    MAX_IMAGE_AMOUNT: 6,
    dateStartLimit: moment().format('YYYY-MM-DD'),
    hubId: '',
    info: {
      activityName: '',
      activityDesc: '',
      activityTime: '',
      expirationTime: '',
    },
    previewImages: [],
    imageURLs: [],
    buttonLoading: false,
  },
  onLoad({ hub }) {
    wxUtil.login().then(() => {
      this.setData({
        hubId: hub,
      })
    })
  },
  checkData() {
    const { info } = this.data
    // 数据校验
    if (!info.activityName) {
      wxUtil.showToast('活动名称必填')
      return false;
    }
    if (!info.activityTime || !info.expirationTime) {
      wxUtil.showToast('活动时间必填')
      return false;
    }
    const activityTime = moment(info.activityTime)
    const expirationTime = moment(info.expirationTime)
    if (!expirationTime.isBefore(activityTime)) {
      wxUtil.showToast('时间范围不正确')
      return false;
    }
    return true;
  },
  handleSubmit() {
    const { info, imageURLs, hubId } = this.data
    if(!this.checkData()){
      return;
    }
    let imgs = {}
    imageURLs.forEach((item, index) => {
      imgs[`img${index + 1}`] = item
    })
    this.setData({
      buttonLoading: true,
    })
    wx.showToast({
      title: '活动创建中',
      icon: 'loading',
    })
    Api.createActivity({
      alumniCircleId: hubId,
      activityName: info.activityName,
      activityDesc: info.activityDesc,
      activityTime: moment(info.activityTime).format('YYYY-MM-DD HH:mm:ss'),
      expirationTime: moment(info.expirationTime).format('YYYY-MM-DD HH:mm:ss'),
      ...imgs,
    }).then(() => {
      wx.hideToast();
      wxUtil.showToast('活动发起成功', 'success')
      setTimeout(() => {
        wxUtil.navigateTo('hubDetail', { hubId })
      }, 1500)
    }, err => {
      this.setData({
        buttonLoading: false,
      })
      wx.hideToast();
      wxUtil.showToast(err.errMsg, 'none')
    })
  },
  handleInputChange(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      [name]: event.detail.value,
    })
  },
  handleRemoveImage(event) {
    const { index } = event.target.dataset
    const previewImages = [...this.data.previewImages]
    const imageURLs = [...this.data.imageURLs]
    previewImages.splice(index, 1)
    imageURLs.splice(index, 1)
    this.setData({ previewImages, imageURLs })
  },
  handleChooseImage() {
    const { previewImages, MAX_IMAGE_AMOUNT } = this.data
    Util.promisify(wx.chooseImage)({
      count: MAX_IMAGE_AMOUNT - previewImages.length,
    }).then(({ tempFilePaths }) => {
      this.setData({
        previewImages: previewImages.concat(tempFilePaths),
      })
      // 上传选择的全部图片
      tempFilePaths.forEach((path, index) => {
        Api.uploadImage(path).then(
          imgUrl => {
            this.setData({
              imageURLs: [...this.data.imageURLs, imgUrl],
            })
          },
          err => {
            wxUtil.showToast(`第${index}张图片：${err.errMsg}`, 'none')
          }
        )
      })
    })
  },
})
