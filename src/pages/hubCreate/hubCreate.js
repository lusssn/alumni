import * as Util from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import server from "../../server"
import * as R from '../../utils/ramda/index'

const app = getApp()

const UPDATE = 'update';
const CREATE = 'create';

Page({
  data: {
    alumniCircleId: '',
    info: {},
    previewImage: '',
    flag: '', // update-校友圈信息更新  create-创建新的圈子
    showModal: false,
  },
  onLoad({ hubId }) {
    wxUtil.login().then(() => {
      if (hubId) {
        this.setData({ flag: UPDATE, alumniCircleId: hubId })
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
      } else {
        this.setData({ flag: CREATE })
      }
    })
  },
  handleSubmit() {
    const { info, flag } = this.data
    if (!info.alumniCircleName) {
      wxUtil.showToast('校友圈名称必填')
      return
    }
    if (flag === UPDATE) {
      Api.updateHubInfo(info).then(
        () => {
          this.setData({ showModal: true })
        },
        () => { wxUtil.showToast('保存失败') }
      )
    }
    else if (flag === CREATE) {
      Api.createHub(info).then(
        (res) => {
          this.setData({ showModal: true })
          this.setData({ alumniCircleId: res.data })
        },
        () => { wxUtil.showToast('保存失败') }
      )
    }
  },
  handleConfirm() {
    this.setData({ showModal: false })
    wxUtil.navigateTo('hubDetail', { hubId: this.data.alumniCircleId })
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
        previewImage: res.tempFilePaths[0],
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
          _this.setData({
            info: R.assoc('avatar', JSON.parse(res.data).data, _this.data.info),
          })
        },
        fail: function (err) {
          wxUtil.showToast(err.errMsg, 'none')
        }
      })
    })
  },
})
