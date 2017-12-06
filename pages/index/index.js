//index.js
//获取应用实例
var api = require('../../utils/api.js')
const app = getApp()

/*Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  clickMe: function () {
    this.setData({ msg: "Hello Wechat" })
  }
})*/

Page({
  data: {
    systemInfo: {},
    _api: {},
    navbar: ['推荐', '新作', '展览'],
    currentNavbar: '0',
    swipers: [],
    list: [],
    hot_last_id: 0,
    latest_list: [],
    latest_last_id: 0,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    picUrls: [
      'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2639088341,2223755776&fm=27&gp=0.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512541214870&di=c6afac0c1e12aeaf205e555d4f9dc8ab&imgtype=0&src=http%3A%2F%2Fpic5.photophoto.cn%2F20071115%2F0034034460738987_b.jpg',
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1512541214870&di=4ee37f162b7c08283eafe281a0ffdeca&imgtype=0&src=http%3A%2F%2Fpic6.photophoto.cn%2F20080102%2F0021033853002313_b.jpg'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },

  onLoad() {
    var that = this
    app.getSystemInfo(function (res) {
      that.setData({
        systemInfo: res
      })
    })

    that.setData({
      _api: api
    })

    this.getSwipers()
    this.pullUpLoad()
  },

  /**
   *
   */
  getSwipers() {
    api.get(api.SWIPERS)
      .then(res => {
        this.setData({
          swipers: res.data.ads
        })
      })
  },

  /**
   * 点击跳转详情页
   */
  onItemClick(e) {
    var targetUrl = api.PAGE_WORK
    if (e.currentTarget.dataset.rowId != null)
      targetUrl = targetUrl + '?rowId=' + e.currentTarget.dataset.rowId
    wx.navigateTo({
      url: targetUrl
    })
  },

  /**
   * 切换 navbar
   */
  swichNav(e) {
    this.setData({
      currentNavbar: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 1 && this.data.latest_list.length == 0) {
      this.pullUpLoadLatest()
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    switch (this.data.currentNavbar) {
      case '0':
        this.setData({
          list: [],
          hot_last_id: 0
        })
        this.pullUpLoad()
        break
      case '1':
        this.setData({
          latest_list: [],
          latest_list_id: 0
        })
        this.pullUpLoadLatest()
        break
      case '2':
        wx.stopPullDownRefresh()
        break
    }
  },

  /**
   * [推荐]上拉刷新
   */
  pullUpLoad() {
    wx.showNavigationBarLoading()
    api.get(api.HOST_IOS + api.HOT + '?last_id=' + this.data.hot_last_id)
      .then(res => {
        this.setData({
          list: this.data.list.concat(res.data.list),
          hot_last_id: res.data.last_id
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
  },

  /**
   * [最新]上拉刷新
   */
  pullUpLoadLatest() {
    wx.showNavigationBarLoading()
    api.get(api.HOST_IOS + api.LATEST + '?last_id=' + this.data.latest_last_id)
      .then(res => {
        this.setData({
          latest_list: this.data.latest_list.concat(res.data.list),
          latest_last_id: res.data.last_id
        })
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      })
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  }

})

