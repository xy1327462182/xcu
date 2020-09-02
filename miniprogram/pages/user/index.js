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
    uInfo: {}
  },

  //获取用户信息 实现注册/登录
  handelGetUserInfo(e){
    let that=this
    let {errMsg}=e.detail
    if (errMsg==='getUserInfo:ok') {
      //用户授权了
      //调用云函数login 获取openid
      wx.cloud.callFunction({
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

  //获取缓存中的登录信息 设置到data中
  getLoginInfo(){
    let that=this
    let res=wx.getStorageSync('userLogin')
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
          that.setData({
            uInfo
          })
        }
      })
      //将数据设置到data中
      // this.setData({
      //   uInfo: res
      // })
    }
  },

  //注销登录
  zhuxaio(){
    wx.removeStorage({
      key: "userLogin"
    })
    this.setData({
      uInfo: null
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