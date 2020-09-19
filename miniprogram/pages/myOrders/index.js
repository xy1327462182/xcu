// pages/myOrders/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  async getPrderDate(){
    let that = this
    wx.showLoading({
      title: '拼命加载中',
    })
    //获取用户信息
    let _openid = wx.getStorageSync('userLogin')._openid
    //查询数据
    let res1 = await wx.cloud.callFunction({
      name: "getUserInfo",
      data: {
        _openid
      }
    })
    let orderList = res1.result.data[0].myOrder
    that.setData({
      orderList
    })
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPrderDate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})