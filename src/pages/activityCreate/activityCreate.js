import * as Util from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import server from "../../server";
import moment from '../../utils/moment.min'

const app = getApp()

Page({
  data: {
    MAX_IMAGE_AMOUNT: 6,
    hubId: '',
    info: {
      activityName: '',
      activityDesc: '',
      activityTime: '',
      expirationTime: '',
    },
    previewImages: [],
    imageURLs: [],
  },
  onLoad({ hub }) {
    wxUtil.login().then(() => {
      this.setData({
        hubId: hub
      })
    })
  },
  handleSubmit() {
    // TODO 数据校验
    const { info, imageURLs, hubId } = this.data
    let imgs = {};
    imageURLs.forEach((item, index) => {
      imgs[`img${index + 1}`] = item
    })
    Api.createActivity({
      alumniCircleId: hubId,
      activityName: info.activityName,
      activityDesc: info.activityDesc,
      activityTime: moment(info.activityTime).format('YYYY-MM-DD HH:mm:ss'),
      expirationTime: moment(info.expirationTime).format('YYYY-MM-DD HH:mm:ss'),
      ...imgs
    }).then((res) => {
      if (res.status == 200) {
        wxUtil.showToast('活动发起成功')
        wxUtil.navigateTo('hubDetail', { hub: hubId })
      }
    }
    ).catch(err => {
      wxUtil.showToast(err.message)
    })
    console.log(this.data.previewImages)
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
    // TODO 删除文件接口待联调
    // Api.deleteFile({fileUrl: imageURLs[index]}).then((res)=> {
    //   previewImages.splice(index, 1)
    //   imageURLs.splice(index, 1)
    //   this.setData({ previewImages, imageURLs })
    //   console.log(imageURLs)
    // }).catch((err) => {
    // })
    previewImages.splice(index, 1)
    imageURLs.splice(index, 1)
    this.setData({ previewImages, imageURLs })
    console.log(imageURLs)
  },
  handleChooseImage() {
    const { previewImages } = this.data
    const amount = this.data.MAX_IMAGE_AMOUNT - this.data.previewImages.length
    Util.promisify(wx.chooseImage)({
      count: amount,
    }).then(res => {
      this.setData({
        previewImages: previewImages.concat(res.tempFilePaths),
      })
      let _this = this;
      wx.uploadFile({
        url: `${server.host}/v2/uploadFile`,
        filePath: res.tempFilePaths[0],
        name: 'file',
        header: {
          'X-Wx-Token': app.global.token,
        },
        success: function (res) {
          const imageURLs = [..._this.data.imageURLs];
          _this.setData({
            imageURLs: [...imageURLs, JSON.parse(res.data).data]
          })
        },
        fail: function (err) {
          console.log(err);
        }
      })
    })
  },
})
