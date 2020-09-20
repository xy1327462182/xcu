//获取数据库引用
const db=wx.cloud.database()

// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uInfo: {},
    tools: [
      {
        id: 0,
        name: '我的收藏',
        icoPath: 'cloud://yang-g4cqy.7961-yang-g4cqy-1302846490/xcu/user/myCollections.png',
        linkPath: "/pages/myCollections/index"
      },
      {
        id: 1,
        name: '我的订单',
        icoPath: 'cloud://yang-g4cqy.7961-yang-g4cqy-1302846490/xcu/user/myOrder.png',
        linkPath: "/pages/myOrders/index"
      },
      {
        id: 2,
        name: '我的商品',
        icoPath: 'cloud://yang-g4cqy.7961-yang-g4cqy-1302846490/xcu/index/indexNav/跳蚤市场ico.png',
        linkPath: "/pages/myGoods/index"
      },
      {
        id: 3,
        name: '我的兼职',
        icoPath: 'cloud://yang-g4cqy.7961-yang-g4cqy-1302846490/xcu/index/indexNav/去兼职.png',
        linkPath: "/pages/myReward/index"
      },
    ],
    oneTrend: {}
  },

  

  //获取用户信息 实现注册/登录
  async handelGetUserInfo(e){
    let that=this
    let {errMsg,userInfo} = e.detail
    wx.showLoading({
      title: '登录中',
    })
    if (errMsg==='getUserInfo:ok') {
      //用户授权了
      //调用云函数login 获取openid
      await wx.cloud.callFunction({
        name: "login",
        data: {},
        success: res1=>{
          //获取openid
          let _openid=res1.result.openid
          //查询数据库是否存在该用户 如果没有，则存储
          that.addUserInfo(_openid,userInfo)
          wx.hideLoading()
        }
      })
    } else if (errMsg==='getUserInfo:fail auth deny') {
      wx.hideLoading({
        success: (res) => {
          //用户取消授权了
          wx.showToast({
            title: '登录失败',
            icon: "none"
          })
        },
      })
      
    }
  },

  //存储用户信息
  async addUserInfo(_openid,userInfo){
    let that = this
    let uInfo = {}
    //获取用户信息
    let res1 = await db.collection('xcu_userInfo').where({
      _openid
    }).get()
    
    //用户没注册过  获取信息 添加到数据库
    if (res1.data.length===0) {
      //初始化用户信息
      uInfo = userInfo
      uInfo._openid = _openid
      uInfo.collectionList = []
      uInfo.myOrder = []
      //添加到数据库
      await wx.cloud.callFunction({
        name: "addUserInfo",
        data: uInfo
      })
    } else {
      uInfo = res1.data[0]
    }
    //将登录信息缓存到本地存储
    wx.setStorageSync('userLogin', uInfo)
    //将用户收藏夹数据存到缓存中
    let collectionList = uInfo.collectionList
    wx.setStorageSync('collectionList', collectionList)
    that.setData({
      uInfo: uInfo
    })
    that.getOneTrends(_openid)
  },

  //获取最近一条动态
  async getOneTrends(_openid){
    //查询当前用户的最近一条动态数据
    let res1 = await db.collection('xcu_trends').where({
      authorOpenId:_openid
    }).orderBy('createTime','desc').limit(1).get()
    let oneTrend = res1.data[0]
    this.setData({
      oneTrend
    })
  },

  //登出
  async handelLogout(){
    let uInfo = wx.getStorageSync('userLogin')
    if (!uInfo._openid) {
      await wx.showToast({
        title: '您还未登录',
        icon: 'none',
        mask: true
      })
      return
    }
    wx.removeStorageSync('userLogin')
    getApp().globalData.uInfo=null
    this.setData({
      uInfo: null,
      oneTrend: null
    })
    wx.showToast({
      title: '注销成功',
      icon: 'success',
      mask: true
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