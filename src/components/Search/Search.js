Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
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
