import wxUtil from "../../utils/wxUtil";
import * as Api from "../api";
import * as Util from "../../utils/util";

Page({
  data: {
    title: "",
    content: "",
    img: "",
    previewImage: "",
    submitLoading: false
  },
  handleSubmit() {
    const { title, content, img } = this.data;
    if (!title) {
      wxUtil.showToast("通知主题必填");
      return;
    }
    if (!content) {
      wxUtil.showToast("通知内容必填");
      return;
    }
    const currentPage = getCurrentPages().pop();
    wxUtil.login().then(() => {
      this.setData({
        submitLoading: true
      });
      Api.batchSendNotice({
        activityId: currentPage.options.activityId,
        title,
        content,
        img
      }).then(
        () => {
          wxUtil.showToast("发送成功", "success");
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        },
        err => {
          wxUtil.showToast(err.errMsg, "none");
        }
      );
    });
  },
  handleInputChange(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      [name]: event.detail.value
    });
  },
  handleRemoveImage() {
    this.setData({
      img: undefined
    });
  },
  handleChooseImage() {
    wxUtil.login().then(() => {
      Util.promisify(wx.chooseImage)({
        count: 1
      }).then(({ tempFilePaths }) => {
        this.setData({
          previewImage: tempFilePaths[0]
        });
        Api.uploadImage(tempFilePaths[0]).then(
          imgUrl => {
            console.log(imgUrl);
            
            this.setData({
              img: imgUrl
            });
          },
          err => {
            wxUtil.showToast(err.errMsg, "none");
          }
        );
      });
    })
  }
});
