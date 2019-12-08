Component({
  options: {
    addGlobalClass: true
  },
  properties: {
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
