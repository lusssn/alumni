Page({
  data: {
    link: ''
  },
  onLoad({link}) {
    this.setData({
      link: decodeURIComponent(link),
    })
  },
});
