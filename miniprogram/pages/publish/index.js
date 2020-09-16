// pages/publish/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icoList: [
      {
        name: "发布二手",
        icoPath: "cloud://yang-g4cqy.7961-yang-g4cqy-1302846490/xcu/publishPage/publishIco_goods.png",
        link: "/pages/publishGoods/index"
      },
      {
        name: "发布动态",
        icoPath: "cloud://yang-g4cqy.7961-yang-g4cqy-1302846490/xcu/publishPage/publishIco_trends.png",
        link: "/pages/publishTrends/index"
      },
      {
        name: "发布兼职",
        icoPath: "cloud://yang-g4cqy.7961-yang-g4cqy-1302846490/xcu/publishPage/publishIco_reward.png",
        link: "/pages/publishReward/index"
      }
    ],
    animation: ""
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
    let animation = wx.createAnimation({
      duration: 450,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.top('60%').step()
    this.setData({
      animation: animation.export()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.animation.top('100%').step()
    this.setData({
      animation: this.animation.export() 
    })
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