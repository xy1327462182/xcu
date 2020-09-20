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
    isGetData: false,
    animation: ''
  },

  //tab栏切换
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
    this.getGoodsData(6)
    //设置公共数据 保存当前位置
    getApp().globalData.urlQuery = {
      nowTabContent: id
    }
  },

  //获取商品数据或者动态数据
  async getGoodsData(num=6){
    let that = this
    let {nowTabContent,isGetData} = that.data
    //避免多次请求数据
    if (isGetData) {
      return
    }
    wx.showLoading({
      title: '拼命加载中',
    })
    that.setData({
      isGetData: true
    })
    if (nowTabContent == 0) {
      //加载商品数据
      let skip = that.data.goodsList.length
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
        //将查询状态更改为false
        that.setData({
          isGetData: false
        })
        return
      }
      //获取旧数据
      let {goodsList}=that.data
      //整合新数据
      goodsList = [...goodsList,...newGoodsList]
      that.setData({
        goodsList,
        isGetData: false
      })
    } else if (nowTabContent == 1) {
      //加载动态数据
      let skip = that.data.trendsList.length
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
        //将查询状态更改为false
        that.setData({
          isGetData: false
        })
        return
      }
      //获取当前用户缓存中点赞的数组 遍历更改点赞状态
      let trendsSupports = wx.getStorageSync('trendsSupports') || []
      newTrendsList.forEach(v=>{
        if (trendsSupports.indexOf(v._id) != -1) {
          //缓存中有，证明已经点过赞了
          v.isZan = true
        } else {
          v.isZan = false
        }
      })
      //获取旧数据
      let {trendsList}=that.data
      //整合新数据
      trendsList = [...trendsList,...newTrendsList]
      that.setData({
        trendsList,
        isGetData: false
      })
      wx.stopPullDownRefresh()
    }
    
    wx.hideLoading()
    wx.stopPullDownRefresh()
  },

  //是否登录
  isLogin(){
    //如果没登录则禁止行为
    let uid = wx.getStorageSync('userLogin')._openid
    if (!uid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        mask: true
      })
      return false
    }
    return true
  },
  
  //动态点赞
  async handeTrendsSupport(e){
    let that = this
    let {id,status,index} = e.currentTarget.dataset
    //判断是否登录  已经点赞，不能再点
    if (!that.isLogin() || status) {
      return 
    }

    this.animation = wx.createAnimation({
      duration: 250,
      timingFunction: 'linear',
      delay: 10, // 动画延迟时间，单位 ms
		  transformOrigin: '50% 50%' // 动画的中心点
    })
    
    //1.前端更改显示的数据
    let {trendsList} = that.data
    trendsList[index].supports++
    trendsList[index].isZan = true

    that.setData({
      trendsList,
    })

    that.animation.scale(1.5).step();
    that.animation.scale(1.0).step();
    that.setData({
      animation: that.animation.export()
    })
    
    //2.更改缓存的数据
    //获取缓存中的旧点赞数据
    let trendsSupports = wx.getStorageSync('trendsSupports') || []
    trendsSupports.unshift(id)
    //重新存入缓存中
    wx.setStorageSync('trendsSupports', trendsSupports)

    //3.更新数据库的数据
    await wx.cloud.callFunction({
      name: "updateTrends",
      data: {
        id,
        supports: true
      }
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
    //获取公共数据中的当前页位置
    if (!getApp().globalData.urlQuery) {
      //如果公共数据没有参数，则默认请求商品数据
      this.getGoodsData()
      return
    }
    let nowTabContent = getApp().globalData.urlQuery.nowTabContent
    let {disTabsList}=this.data
    disTabsList.forEach(v=>{
      v.id === nowTabContent ? v.isActive=true:v.isActive=false
    })
    this.setData({
      goodsList: [],
      trendsList: [],
      disTabsList,
      nowTabContent,
    })
    this.getGoodsData(6)
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
      trendsList: []
    })
    this.getGoodsData(6)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getGoodsData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})