Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    /**
     * 组件是否展示
     */
    isShowSheet: { type: Boolean, value: false },
    /**
     * 标题，显示在组件最上方
     */
    title: { type: String, value: '' },
    /**
     * 菜单项文本
     */
    itemList: { type: Array },
  },
  data: {
    isShowSheet: true
  },
  methods: {
    handleClose(event) {
      this.setData({
        isShowSheet: false
      })
    },
    handleClick(e) {
      const index = e.currentTarget.dataset.index
      this.triggerEvent('select', {index});
    },
  }
})
