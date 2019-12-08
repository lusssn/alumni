Component({
  properties: {
    /**
     * 头像尺寸，单位rpx
     */
    size: { type: Number, value: 90 },
    /**
     * 默认头像路径
     */
    defaultSrc: { type: String, value: '../../images/avatar_default.jpeg' },
    /**
     * 头像路径
     */
    src: { type: String, value: '' },
  },
})
