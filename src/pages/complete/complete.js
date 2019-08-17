import * as R from '../../utils/ramda/index'
import * as Api from '../api'
import { promisify, checkParams, getYear } from '../../utils/util'
import wxUtil from '../../utils/wxUtil'
import {
  GENDER_TYPE, DEGREE_TYPE, COLLEGE_TYPE,
  BASIC_FIELD, EDUCATION_FIELD, WORK_FIELD,
} from '../../macros'
import moment from '../../utils/moment.min'

const app = getApp()
// 1990-01-01
const BIRTHDAY_INIT = 631123200000

Page({
  data: {
    isLoaded: false,
    genderSelect: GENDER_TYPE,
    degreeSelect: DEGREE_TYPE,
    collegeSelect: COLLEGE_TYPE,
    account: {},
    education: {},
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
            account.birthday = moment(account.birthday || BIRTHDAY_INIT).format('YYYY-MM-DD')
            // 处理性别
            account.gender = R.findIndex(R.propEq('id', account.gender), GENDER_TYPE)

            const education = educations[0] || {}
            education.startTime = getYear(education.startTime)
            education.endTime = getYear(education.endTime)
            // 处理院系
            if (education.college) {
              education.college = R.findIndex(R.propEq('id', +education.college), COLLEGE_TYPE)
            }
            // 处理学历
            education.education = R.findIndex(
              R.propEq('name', education.education || '本科'),
            )(DEGREE_TYPE)
            // 处理院系
            education.college = R.findIndex(
              R.propEq('id', education.college),
            )(COLLEGE_TYPE)

            const job = jobs[0] || {}
            job.startTime = getYear(job.startTime)
            job.endTime = getYear(job.endTime)

            this.setData({
              isLoaded: true,
              account,
              education,
              job,
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
    // 处理学历
    const degree = DEGREE_TYPE[education.education] || {}
    education = R.assoc('education', degree.name, education)
    // 处理学院
    const college = COLLEGE_TYPE[education.college] || {}
    education = R.assoc('college', college.id, education)

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
      educations: [education],
      jobs: [job],
    }).then(() => {
      wxUtil.showToast('保存成功', 'success').then(() => {
        const { redirect, options } = this.data
        wxUtil.navigateTo(redirect, JSON.parse(options), true)
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
