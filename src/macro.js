// 性别
export const GENDER_TYPE = [
  { id: 1, name: '男' },
  { id: 2, name: '女' },
]

// 学历
export const DEGREE_TYPE = [
  { id: 5, name: '专科' },
  { id: 4, name: '本科' },
  { id: 3, name: '硕士' },
  { id: 2, name: '博士' },
  { id: 1, name: '其他' },
]

// 关系类型
export const CONTACT_TYPE = [
  { id: 0, name: '陌生人', key: 'STRANGER' },
  { id: 1, name: '好友', key: 'FRIEND' },
  { id: 2, name: '请求交换名片', key: 'YES_OR_NO' },
  { id: 3, name: '已申请交换名片', key: 'SEASSI' },
  { id: 4, name: '拒绝了您的请求', key: 'BE_REFUSED' },
  { id: 5, name: '同意了您的请求', key: 'BE_AGREED' },
]

// 个人信息配置
export const BASIC_FIELD = [
  { name: '真实姓名', prop: 'real_name', isMust: true },
  { name: '性别', prop: 'real_name', isMust: true },
  { name: '出生年月', prop: 'birth', defaultValue: '' },
  { name: '自我描述', prop: 'descr', isMust: true },
  { name: '定位', prop: 'city', isMust: true },
  { name: '手机号码', prop: 'phone', isMust: true },
  { name: '微信号', prop: 'wechat', defaultValue: '' },
  { name: '邮箱', prop: 'email', defaultValue: '' },
]

// 教育信息配置
export const EDUCATION_FIELD = [
  { name: '学校名称', prop: 'school', isMust: true },
  { name: '学历', prop: 'background', isMust: true },
  { name: '院系', prop: 'department', isMust: true },
  { name: '专业', prop: 'profession', defaultValue: '' },
  { name: '入学年份', prop: 'start_year', defaultValue: '' },
  { name: '毕业时间', prop: 'end_year', defaultValue: '' },
]

// 工作信息配置
export const WORK_FIELD = [
  { name: '公司名称', prop: 'company', isMust: true },
  { name: '职位名称', prop: 'job', isMust: true },
  { name: '入职时间', prop: 'start_year', defaultValue: '' },
  { name: '离职时间', prop: 'end_year', defaultValue: '' },
]