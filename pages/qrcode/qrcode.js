Page({
  data: {
    img: '/images/wechat-qrcode.png',
  },

  onLoad: function (options) {
    if (options.pay == 'wechat') {
      this.data.img = '/images/wechat-qrcode.png'
    } else {
      this.data.img = '/images/alipay-qrcode.jpg'
    }
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  }
})
