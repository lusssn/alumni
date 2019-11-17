Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    data: {
      type: Object, value: {},
    },
    handleEdit: {
      type: Function
    }
  },
  methods: {
    handleEdit(){
      this.triggerEvent('handleEdit');
    }
  }
})
