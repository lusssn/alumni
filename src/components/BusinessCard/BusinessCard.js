import { COLLEGE_TYPE } from '../../macros'

Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    data: {
      type: Object, value: {},
    },
  },
  data: {
    collegeTypeMap: {},
  },
  lifetimes: {
    attached: function () {
      const collegeTypeMap = {}
      COLLEGE_TYPE.forEach(item => {
        collegeTypeMap[item.id] = item.name
      })
      this.setData({ collegeTypeMap })
    },
  },
})
