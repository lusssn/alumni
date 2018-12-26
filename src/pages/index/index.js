import wxUtil from '../../utils/wxUtil'

Page({
  handleClickSearch() {
    wxUtil.navigateTo('search')
  },
  handleClickCard() {
    wxUtil.navigateTo('detail')
  }
})
