import * as Util from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

Page({
  alumniCircleId: '',
  data: {
    info: {},
    previewImage: '',
    showModal: false,
    submitLoading: false,
  },
  onLoad({ hubId }) {
    wxUtil.login().then(() => {
      if (hubId) {
        this.alumniCircleId = hubId;
        Api.getHubInfo({ alumniCircleId: hubId }).then(
          res => {
            this.setData({
              info: R.omit(['ctime', 'isAvailable', 'utime'], res),
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
    this.setData({
      submitLoading: true,
    })
    const { info } = this.data
    if (!info.alumniCircleName) {
      wxUtil.showToast('校友圈名称必填')
      return
    }
    if (info.alumniCircleId) {
      Api.updateHubInfo(info).then(
        () => {
          this.setData({
            showModal: true,
            submitLoading: false,
          })
        },
        () => {
          wxUtil.showToast('保存失败')
          this.setData({
            submitLoading: false,
          })
        },
      )
    }
    else if (!info.alumniCircleId) {
      Api.createHub(info).then(
        (res) => {
          this.setData({
            showModal: true,
            submitLoading: false,
          })
          this.alumniCircleId = res.data;
        },
        () => {
          wxUtil.showToast('保存失败')
          this.setData({
            submitLoading: false,
          })
        },
      )
    }
  },
  handleConfirm() {
    this.setData({ showModal: false })
    wxUtil.navigateTo('hubDetail', { hubId: this.alumniCircleId })
  },
  handleInputChange(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      [name]: event.detail.value,
    })
  },
  handleRemoveAvatar() {
    this.setData({
      info: R.assoc('avatar', '', this.data.info),
    })
  },
  handleChooseAvatar() {
    Util.promisify(wx.chooseImage)({
      count: 1,
    }).then(({ tempFilePaths }) => {
      this.setData({
        previewImage: tempFilePaths[0],
      })
      Api.uploadImage(tempFilePaths[0]).then(
        imgUrl => {
          this.setData({
            info: R.assoc('avatar', imgUrl, this.data.info),
          })
        },
        err => {
          wxUtil.showToast(err.errMsg, 'none')
        },
      )
    })
  },
})
