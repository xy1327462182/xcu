// pages/myCollections/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectionList: []
  },
  //获取收藏数据
  async getCollectionDate(){
    let that = this
    wx.showLoading({
      title: '拼命加载中',
    })
    //获取当前用户登录信息 获取缓存中的收藏夹数据
    let _openid=wx.getStorageSync('userLogin')._openid
    let collectionList = wx.getStorageSync('collectionList') || []
    if (collectionList.length > 0) {
      //优先取缓存的数据 再将缓存中的数据存入数据库
      this.setData({
        collectionList
      })
      // 将数据存入数据库
      await wx.cloud.callFunction({
        name: "updateUserInfo",
        data: {
          collectionList,
          _openid
        }
      })
    }
    wx.hideLoading()
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
    //获取用户登录信息
    let _openid = wx.getStorageSync('userLogin')._openid
    if (!_openid) {
      //没登录
      
      return
    }
    this.getCollectionDate()
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