Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /**
     * 是否激活态
     */
    active: { type: Boolean, value: false },
    /**
     * 标签icon，只支持iconfont中的icon
     */
    icon: { type: String, value: '' },
    /**
     * 标签文案
     */
    text: { type: String, value: '' },
  },
})
