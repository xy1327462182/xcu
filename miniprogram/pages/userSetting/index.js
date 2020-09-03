const app=getApp()

// pages/userSetting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false
  },

  //注销账号
  logout(){
    wx.removeStorage({
      key: "userLogin"
    })
    getApp().globalData.uInfo=null
    console.log(getApp().globalData);
    
    wx.switchTab({
      url: '/pages/user/index',
    })    
  },

  handelIsLogin(){
    let res=wx.getStorageSync('userLogin')
    if (res._openid) {
      //如果缓存有 是登录状态
      this.setData({
        isLogin: true
      })
    } else {
      //不是登录状态
      this.setData({
        isLogin: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.handelIsLogin()
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