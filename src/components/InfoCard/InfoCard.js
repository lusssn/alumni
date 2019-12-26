Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    data: {
      type: Object, value: {},
    },
    allField: {
      type: Boolean, value: true
    },
    handleEdit: {
      type: Function
    }
  },
  methods: {
    handleEdit(){
      this.triggerEvent('handleEdit');
    },
    handleClickAvatar(){
      wx.previewImage({
        current: this.properties.data[0].avatar,
        urls: [this.properties.data[0].avatar]
      })
    }
  }
})
