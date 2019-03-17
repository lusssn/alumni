Component({
  properties: {
    isOpen: {
      type: Boolean, value: false,
    },
    title: {
      type: String, value: '',
    },
    content: {
      type: Array, value: [],
    },
    cancelText: {
      type: String, value: '',
    },
    // 点击左边按钮的开发类型
    cancelOpenType: {
      type: String, value: '',
    },
    okText: {
      type: String, value: '确认',
    },
    // 点击右边按钮按钮的开发类型
    okOpenType: {
      type: String, value: '',
    },
  },
  methods: {
    handleClose(event) {
      // emit event
      this.triggerEvent('cancel', { event })
    },
    handleOk(event) {
      // emit event
      this.triggerEvent('ok', { event })
    },
  }
})
