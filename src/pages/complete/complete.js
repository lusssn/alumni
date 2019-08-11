import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { promisify, checkParams } from '../../utils/util'
import wxUtil from '../../utils/wxUtil'

import {
  DEGREE_TYPE, GENDER_TYPE,
  BASIC_FIELD, EDUCATION_FIELD, WORK_FIELD,
} from '../../macros'
import moment from '../../utils/moment.min'

const app = getApp()

Page({
  data: {
    isLoaded: false,
    degreeSelect: DEGREE_TYPE,
    genderSelect: GENDER_TYPE,
    account: {
      birthday: '1990-01-01',
    },
    education: {
      education: R.findIndex(R.propEq('name', '本科'))(DEGREE_TYPE),
    },
    job: {},
    isStudent: true,
    redirect: '', // 完善后跳转的路径
    options: '', // 完善后跳转的路径参数
  },
  onLoad(option) {
    const { redirect = 'mine', options = '{}', isStudent } = option
    this.setData({
      redirect,
      options: decodeURIComponent(options),
      isStudent: +isStudent,
    })
    // 登录
    wxUtil.login().then(
      () => {
        // 获取用户信息
        Api.getAccountAll({
          myAccountId: app.global.accountId,
          accountId: app.global.accountId,
        }).then(
          data => {
            const { account, educations, jobs } = data
            account.gender = Number(account.gender)
            // 处理时间
            account.birthday = moment(account.birthday).format('YYYY-MM-DD')
            for (let item of educations) {
              item.startTime = moment(item.startTime).format('YYYY')
              item.endTime = moment(item.endTime).format('YYYY')
              // 处理学历
              item.education = R.findIndex(
                R.propEq('name', item.education),
              )(DEGREE_TYPE)
            }
            for (let item of jobs) {
              item.startTime = item.startTime ? moment(item.startTime).format('YYYY') : ''
              item.endTime = item.endTime ? moment(item.endTime).format('YYYY') : ''
            }
            this.setData({
              isLoaded: true,
              account,
              education: educations[0] || {},
              job: jobs[0] || {},
            })
          },
          () => {},
        )
      },
    )
  },
  handleClickAvatar() {
    promisify(wx.chooseImage)({
      count: 1,
    }).then(res => {
      this.setData({
        'account.avatar': res.tempFilePaths.pop(),
      })
    })
  },
  // 定位
  handleLocation() {
    wxUtil.getLocation().then(res => {
      if (!res) {
        wxUtil.showToast('没有定位到')
        return
      }
      this.setData({ 'account.city': res })
    }, err => {
      promisify(wx.showModal)({
        title: '错误提示',
        content: err.errMsg,
        confirmText: '关闭',
        confirmColor: '#2180E8',
        showCancel: false,
      })
    })
  },
  handleInputChange(e) {
    const { name } = e.currentTarget.dataset
    this.setData({
      [name]: e.detail.value,
    })
  },
  handleSkip() {
    const { redirect, options } = this.data
    wxUtil.navigateTo(redirect, JSON.parse(options), true)
  },
  handleSave() {
    let { account, education, job, isStudent } = this.data
    // 处理degree
    const degree = DEGREE_TYPE[education.education] || {}
    education = R.assoc('education', degree.name, education)

    // 必填项判断
    account = checkParams(BASIC_FIELD, account)
    if (R.isEmpty(account)) return

    education = checkParams(EDUCATION_FIELD, education)
    if (R.isEmpty(education)) return
    education.accountId = app.global.accountId

    if (!isStudent) {
      job = checkParams(WORK_FIELD, job)
      if (R.isEmpty(job)) return
      job.accountId = app.global.accountId
    }
    // 提交数据
    Api.completeCard({
      account,
      education,
      job,
    }).then(() => {
      wxUtil.showToast('保存成功', 'success').then(() => {
        const { redirect, options } = this.data
        wxUtil.navigateTo(redirect, JSON.parse(options), 'all')
      })
    }, err => {
      promisify(wx.showModal)({
        title: '错误提示',
        content: JSON.stringify(err),
        confirmText: '关闭',
        confirmColor: '#2180E8',
        showCancel: false,
      })
    })
  },
})
