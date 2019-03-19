import wxUtil from '../../utils/wxUtil'
import request from '../../utils/request'

Page({
  handleSearch(e) {
    const content = e.detail.value
    request.get(`/search/searchdirect/${content}`).then(res => {
      console.log(res)
    }, () => {})
  },
  handleSearchDetail() {
    wxUtil.navigateTo('searchList')
  },
})
