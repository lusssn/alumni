import * as Util from "../../utils/util";
import wxUtil from "../../utils/wxUtil";
import * as Api from "../api";

const DEMAND_TYPE = ["内推招聘", "行业合作", "信息发布"];

Page({
  data: {
    DEMAND_TYPE,
    MAX_IMAGE_AMOUNT: 6,
    info: {
      demandName: "",
      type: "",
      tags: "",
      details: ""
    },
    previewImages: [],
    imageURLs: [],
    buttonLoading: false
  },
  onLoad() {
    wxUtil.login();
  },
  checkData() {
    const { info } = this.data;
    // 数据校验
    if (!info.demandName) {
      wxUtil.showToast("需求名称必填");
      return false;
    }
    if (!info.type) {
      wxUtil.showToast("需求类型必选");
      return false;
    }
    if (!info.tags) {
      wxUtil.showToast("请输入标签");
      return false;
    }
    return true;
  },
  handleSubmit() {
    const { info, imageURLs } = this.data;
    if (!this.checkData()) {
      return;
    }
    let imgs = {};
    imageURLs.forEach((item, index) => {
      imgs[`img${index + 1}`] = item;
    });
    this.setData({
      buttonLoading: true
    });
    wx.showToast({
      title: "需求创建中",
      icon: "loading"
    });
    Api.createDemand({
      demandName: info.demandName,
      type: parseInt(info.type) + 1,
      tags: info.tags,
      details: info.details,
      ...imgs,
    }).then(() => {
      wx.hideToast();
      wxUtil.showToast('需求发起成功', 'success')
      wx.navigateBack();
    }, err => {
      this.setData({
        buttonLoading: false,
      })
      wx.hideToast();
      wxUtil.showToast(err.errMsg, 'none')
    })
  },
  handleInputChange(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      [name]: event.detail.value
    });
  },
  handleRemoveImage(event) {
    const { index } = event.target.dataset;
    const previewImages = [...this.data.previewImages];
    const imageURLs = [...this.data.imageURLs];
    previewImages.splice(index, 1);
    imageURLs.splice(index, 1);
    this.setData({ previewImages, imageURLs });
  },
  handleChooseImage() {
    const { previewImages, MAX_IMAGE_AMOUNT } = this.data;
    Util.promisify(wx.chooseImage)({
      count: MAX_IMAGE_AMOUNT - previewImages.length
    }).then(({ tempFilePaths }) => {
      this.setData({
        previewImages: previewImages.concat(tempFilePaths)
      });
      // 上传选择的全部图片
      tempFilePaths.forEach((path, index) => {
        Api.uploadImage(path).then(
          imgUrl => {
            this.setData({
              imageURLs: [...this.data.imageURLs, imgUrl]
            });
          },
          err => {
            wxUtil.showToast(`第${index}张图片：${err.errMsg}`, "none");
          }
        );
      });
    });
  }
});
