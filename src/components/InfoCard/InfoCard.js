Component({
  options: {
    addGlobalClass: true,
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
    }
  }
})
