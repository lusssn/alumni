import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

Page({
  data: {
    list: [],
  },
  onLoad({ content, way }) {
    Api.getSearchResult({
      content: decodeURI(content),
      way,
    }).then(data => {
      this.setData({
        list: data.content,
      })
    })
  },
  onReachBottom() {},
  handleClickCard(e) {
    const { id } = e.currentTarget.dataset
    wxUtil.navigateTo('detail', { id })
  },
})
