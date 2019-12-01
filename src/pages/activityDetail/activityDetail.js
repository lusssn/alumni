import wxUtil from '../../utils/wxUtil'
import * as Api from '../api'

Page({
  data: {
    originator: {
      accountId: 3244866041856,
      avatar: 'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqMeko1pzUxUnIPzhYzdMYqw96hIOsdVg5liclMn94iaTsDRxuMVlq9T9QCKQugqWHKMTOvopaMoArA/132',
      city: '深圳市',
      college: '软件工程',
      company: '腾讯',
      name: '孙叶',
      position: '产品经理',
      recommondReason: '同学院',
      school: '东南大学',
      selfDesc: '产品设计师',
    },
    activity: {},
  },
  onLoad({ id }) {
    if (!id) {
      wxUtil.showToast('不存在此活动')
      return
    }
    // 加载详情数据
    wxUtil.login().then(() => {
      Api.getActivityDetail({ activityId: id }).then(
        res => { this.setData({ activity: res }) },
        () => {},
      )
    })
  }
})
