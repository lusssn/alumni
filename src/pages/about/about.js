import moment from '../../utils/moment.min'

Page({

  data: {
    access_token: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log(moment().valueOf())
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
