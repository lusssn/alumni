import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'
import * as R from '../../utils/ramda/index'

const IMAGE_COUNT = 6
const TAG_COUNT = 5
const IMAGE_WIDTH = 606 // 单位rpx

Page({
  data: {
    demand: {},
    tags:[],
    images: [],
  },
  onLoad({ demandId }) {
    if (!demandId) {
      wxUtil.showToast('不存在此需求')
      return
    }
    // 加载详情数据
    wxUtil.login().then(() => {
      Api.getDemandDetail({ demandId }).then(
        res => {
          const images = []
          const tags = []
          for (let i = 1; i <= TAG_COUNT; i++) {
            const text = res[`tag${i}`]
            text && tags.push(text)
          }
          for (let i = 1; i <= IMAGE_COUNT; i++) {
            const url = res[`img${i}`]
            url && images.push({ url })
          }
          this.setData({
            demand: res,
            tags,
            images,
          })
        },
        () => {},
      )
    })
  },
  onShareAppMessage() {
    const { demand } = this.data
    return {
      title: `SEU 校友圈-邀请您参与${demand.demandName}`,
      path: `/pages/demandDetail/demandDetail?demandId=${demand.demandId}`,
    }
  },
  handleLoadImage(event) {
    const { images } = this.data
    const { height, width } = event.detail
    const { index } = event.target.dataset
    this.setData({
      images: R.assocPath(
        [index],
        R.mergeRight(images[index], {
          height: height / width * IMAGE_WIDTH,
        }),
        images,
      ),
    })
  },
  handleJoinDemand() {
    const { accountId } = this.data.demand;
    wxUtil.navigateTo('alumniDetail', { id: accountId })
  },
})
