// pages/reward/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rewardList: []
  },

  async getRewardDate(skip,limit){
    let that = this
    wx.showLoading({
      title: '拼命加载中',
    })
    let res1 = await wx.cloud.callFunction({
      name: "getReward",
      data: {
        status: '上架',
        skip,
        limit
      }
    })
    //数组翻转
    let resRewardList = res1.result.res1.data.reverse()
    //获取旧数据
    let oldRewardList = that.data.rewardList
    let rewardList = [...oldRewardList,...resRewardList]
    that.setData({
      rewardList
    })
    wx.hideLoading({
      success: (res) => {
        wx.stopPullDownRefresh()
      },
    })
    
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
    let {rewardList} = this.data
    if (rewardList.length <= 0) {
      this.getRewardDate(0,5)
    }
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
    //清空数据
    this.setData({
      rewardList: []
    })
    //重新请求数据
    this.getRewardDate(0,5)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let skip = this.data.rewardList.length
    let limit = 5
    this.getRewardDate(skip, limit)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})