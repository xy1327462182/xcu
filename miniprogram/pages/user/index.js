//获取数据库引用
const db=wx.cloud.database()
const xcuUserInfo=db.collection('xcu_userInfo')

const app=getApp()

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
    ]
  },

  //获取用户信息 实现注册/登录
  async handelGetUserInfo(e){
    let that=this
    let {errMsg}=e.detail
    if (errMsg==='getUserInfo:ok') {
      //用户授权了
      //调用云函数login 获取openid
      await wx.cloud.callFunction({
        name: "login",
        data: {},
        success:res1=>{
          //获取openid
          let uid=res1.result.openid
          //数据库查找该用户
          xcuUserInfo.where({
            _openid: uid
          }).get()
            .then(res2=>{
              //用户没注册过  获取信息 添加到数据库
              if (res2.data.length===0) {
                //用户没注册过 
                  //获取信息 添加到数据库
                let data={}
                data=e.detail.userInfo
                data._openid=uid
                data.fans=1
                data.follow=0
                data.supports=0
                //添加到数据库
                wx.cloud.callFunction({
                  name: "addUserInfo",
                  data: data
                })
              }
              //将用户登录数据存储到本地存储
              let login={
                _openid:uid
              }
              wx.setStorageSync('userLogin', login)
              //将用户openid存到公共数据中
              getApp().globalData.openid = uid;
              //将用户收藏夹数据存到缓存中
              let collectionList = res2.data[0].collectionList
              wx.setStorageSync('collectionList', collectionList)

              that.getLoginInfo()
            })
        }
      })
    } else if (errMsg==='getUserInfo:fail auth deny') {
      //用户取消授权了
      wx.showToast({
        title: '登录失败',
        icon: "none"
      })
    }
  },

  //获取缓存中的登录信息 设置到app.globalData中
  getLoginInfo(){
    let that=this
    let res=wx.getStorageSync('userLogin')
    //如果缓存中有
    if (res._openid) {
      //是登录状态
      //从数据库中查询数据
      wx.cloud.callFunction({
        name: "getUserInfo",
        data: {
          _openid: res._openid
        },
        success:data=>{
          let uInfo=data.result.data[0]
          app.globalData.uInfo=uInfo
          that.setData({
            uInfo
          })
        }
      })
    } else {
      that.setData({
        uInfo: null
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
    this.getLoginInfo()
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