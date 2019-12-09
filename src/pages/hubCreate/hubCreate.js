import * as Util from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

Page({
  data: {
    info: {},
  },
  onLoad({ hub }) {
    wxUtil.login().then(() => {
      if (hub) {
        Api.getHubInfo({ alumniCircleId: hub }).then(
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
    const { info } = this.data
    Api.updateHubInfo(info).then(
      () => { wxUtil.showToast('保存成功', 'success') },
      () => { wxUtil.showToast('保存失败') }
    )
  },
  handleInputChange(event) {
    const { name } = event.currentTarget.dataset
    this.setData({
      [name]: event.detail.value,
    })
  },
  handleRemoveAvatar() {
    this.setData({
      info: R.assoc('avatar', '', this.data.info)
    })
  },
  handleChooseAvatar() {
    Util.promisify(wx.chooseImage)({
      count: 1,
    }).then(res => {
      this.setData({
        info: R.assoc('avatar', res.tempFilePaths, this.data.info),
      })
    })
  },
})
