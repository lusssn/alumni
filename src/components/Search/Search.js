Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    className: { type: String, value: '' },
    placeholder: { type: String, value: '' },
    /**
     * 对其方式：默认（''），居中（center）
     */
    alignType: { type: String, value: '' },
    disabled: { type: Boolean, value: false },
  },
  data: {
    selfClassName: '',
  },
  lifetimes: {
    attached() {
      // 根据props拼接class名称
      const { className, alignType } = this.data
      const classArray = []
      if (alignType === 'center') {
        classArray.push('search-center')
      }
      if (className) {
        classArray.push(className)
      }
      this.setData({
        selfClassName: classArray.join(' ')
      })
    },
  },
  methods: {
    handleSearch(event) {
      const value = event.detail.value
      // emit event
      this.triggerEvent('confirm', { value })
    },
    handleTap() {
      this.triggerEvent('tap')
    },
  },
})
