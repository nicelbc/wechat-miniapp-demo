// logs.js
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return new Date(log).toLocaleString()
      })
    })
  }
})