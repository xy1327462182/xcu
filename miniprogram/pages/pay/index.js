// pages/pay/index.js
let db = wx.cloud.database()
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodInfo: {},
    myAddress: {},
    uname: "",
    phone: "",
    infoAddress: ""
  },

  getAddress(){
    let myAddress = wx.getStorageSync('myAddress') || null
    this.setData({
      myAddress
    })
  },

  //修改地址
  handelChangeAddress(){
    wx.setStorageSync('myAddress', null)
    this.getAddress()
  },

  //是否登录
  isLogin(){
    //如果没登录则禁止行为
    let uid = wx.getStorageSync('userLogin')._openid
    if (!uid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    return true
  },
  //事件格式装换
  formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD +" "+hh + mm + ss;
  },

  handelUname(e){
    let uname = e.detail.value
    if (uname) {
      this.setData({
        uname
      })
    }
  },
  handelPhone(e){
    let phone = e.detail.value
    if (phone) {
      this.setData({
        phone
      })
    }
  },
  handelInfoAddress(e){
    let infoAddress = e.detail.value
    if (infoAddress) {
      this.setData({
        infoAddress
      })
    }
  },

  handelSub(){
    let that = this
    if (!that.isLogin()) {
      return 
    }
    let {uname,phone,infoAddress} = this.data
    let myAddress = {
      uname,
      phone,
      infoAddress
    }
    wx.setStorageSync('myAddress', myAddress)
    this.getAddress()
  },

  async handelBuy(){
    let that = this
    let myAddress = wx.getStorageSync('myAddress') || null
    if (!myAddress) {
      wx.showToast({
        title: '请添加收货地址',
        icon: "none"
      })
    } else {
      //从缓存中删掉  从数据库中删掉、
      wx.showLoading({
        title: '拼命加载中',
      })
      //获取缓存数据
      let collectionList = wx.getStorageSync('collectionList')
      let {goodInfo} = that.data
      //删除本商品数据 获得新收藏数组
      let newCollectionList = collectionList.filter((v)=>{
        return v.goodsId != goodInfo._id
      })
      //重新存入缓存
      wx.setStorageSync('collectionList', newCollectionList)
      //获取用户信息
      let _openid = that.data.goodInfo.userInfo.openId
      //更新数据库
      await wx.cloud.callFunction({
        name: "updateUserInfo",
        data: {
          _openid,
          collectionList: newCollectionList
        }
      })
      wx.hideLoading()
      await wx.showToast({
        title: '购买成功',
        icon: 'success',
      })
      //创建订单 存入数据库
      let newOrder = {
        orderId: Date.now() + parseInt(Math.random()*10000),
        goodsInfo: that.data.goodInfo,
        orderDate: that.formatDate(Date.now()) 
      }
      //订单 存入数据库
      await wx.cloud.callFunction({
        name: "updateUserInfo",
        data: {
          _openid,
          newOrder: newOrder
        }
      })
      wx.switchTab({
        url: '/pages/user/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let id=options.id
    //从数据库查找商品
    db.collection('xcu_goods').doc(id.trim()).get()
      .then(res1=>{
        let goodInfo=res1.data
        that.setData({
          goodInfo
        })
      })
      .catch(err=>console.log(err))

    that.getAddress()
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