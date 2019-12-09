import moment from '../../utils/moment.min'
import * as R from '../../utils/ramda/index'

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    data: {
      type: Object, value: {},
    },
  },
  lifetimes: {
    attached() {
      // 转换startTime
      const { data } = this.data
      if (data.startTime) {
        const year = moment(data.startTime).format('YYYY级')
        this.setData({
          data: R.assoc('startTime', year, data)
        })
      }
    },
  },
})
