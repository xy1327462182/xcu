// pages/pay/index.js
let db = wx.cloud.database()

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
    if (myAddress) {
      this.setData({
        myAddress
      })
    } else {
      
    }
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
    let {uname,phone,infoAddress} = this.data
    let myAddress = {
      uname,
      phone,
      infoAddress
    }
    wx.setStorageSync('myAddress', myAddress)
    this.getAddress()
  },

  handelBuy(){
    
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