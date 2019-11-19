Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    className: { type: String, value: '' },
    data: { type: Array, value: [] },
    current: { type: Number, value: 0 },
  },
  methods: {
    //点击切换
    handleClickNav(e) {
      const { id } = e.target.dataset
      this.triggerEvent('switch', { id })
    }
  }
})
