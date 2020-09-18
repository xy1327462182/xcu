let db=wx.cloud.database()

// pages/discover/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disTabsList: [
      {
        name: "好物",
        isActive: true,
        id:0
      },
      {
        name: "动态",
        isActive: false,
        id:1
      }
    ],
    goodsList: [],
    trendsList: [],
    nowTabContent: 0,
    skips: 0
  },

  handelTabChange(e){
    let {id}=e.currentTarget.dataset
    let {disTabsList}=this.data
    disTabsList.forEach(v=>{
      v.id === id ? v.isActive=true:v.isActive=false
    })
    //点击tab栏切换 更改当前页索引 并清空旧数据 重新请求
    this.setData({
      disTabsList,
      nowTabContent: id,
      goodsList: [],
      skip: 0
    })
    this.getGoodsData(6,0)
  },

  //获取商品数据
  async getGoodsData(num=6,skip=0){
    let that = this
    let {nowTabContent} = that.data
    wx.showLoading({
      title: '拼命加载中',
    })
    if (nowTabContent == 0) {
      //加载商品数据
      //调用云函数查询商品数据
      let result = await wx.cloud.callFunction({
        name: 'getGoods',
        data: {
          num: 6,
          skip,
        }
      })
      //新获得的数据
      let newGoodsList = result.result.data
      if (newGoodsList.length <= 0) {
        wx.showToast({
          title: '越努力，越幸运！到底啦！',
          icon: 'none',
          mask: true,
          duration: 600
        })
        return
      }
      //获取旧数据
      let {goodsList}=that.data
      //整合新数据
      goodsList = [...goodsList,...newGoodsList]
      let skips = goodsList.length
      that.setData({
        goodsList,
        skips
      })
    } else if (nowTabContent == 1) {
      //加载动态数据
      //调用云函数查询动态数据
      let result2 = await wx.cloud.callFunction({
        name: 'getTrends',
        data: {
          num: 6,
          skip,
        }
      })
      //新获得的数据
      let newTrendsList = result2.result.data
      if (newTrendsList.length <= 0) {
        wx.showToast({
          title: '越努力，越幸运！到底啦！',
          icon: 'none',
          mask: true,
          duration: 600
        })
        return
      }
      //获取旧数据
      let {trendsList}=that.data
      //整合新数据
      trendsList = [...trendsList,...newTrendsList]
      let skips = trendsList.length
      that.setData({
        trendsList,
        skips
      })
    }
    
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onPullDownRefresh()
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
    //清空数据
    // skip置0
    this.setData({
      goodsList: [],
      skip: 0
    })
    this.getGoodsData(6,0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let skip = this.data.skips
    this.getGoodsData(6,skip)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})