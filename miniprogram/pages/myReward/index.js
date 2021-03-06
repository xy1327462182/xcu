// pages/myReward/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rewardList: []
  },

  async getRewardData(){
    let that = this
    wx.showLoading({
      title: '拼命加载中',
    })
    //获取用户信息
    let _openid = wx.getStorageSync('userLogin')._openid
    let res1 = await wx.cloud.callFunction({
      name: "getReward",
      data: {
        _openid
      }
    })
    let rewardList = res1.result.res2.data.reverse()
    that.setData({
      rewardList
    })
    wx.hideLoading()
  },

  async handelDel(e){
    wx.showLoading({
      title: '删除中',
    })
    let _id = e.currentTarget.dataset.id
    await wx.cloud.callFunction({
      name: "delReward",
      data: {
        _id
      }
    })
    this.getRewardData()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取数据
    this.getRewardData()
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