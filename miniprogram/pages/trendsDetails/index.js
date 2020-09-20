let db = wx.cloud.database()
// pages/trendsDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trendsItem: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let id = options.id
    //查询数据
    db.collection('xcu_trends').doc(id).get()
      .then(res1=>{
        //获取当前用户缓存中点赞的数组 遍历更改点赞状态
        let trendsSupports = wx.getStorageSync('trendsSupports') || []
        if (trendsSupports.indexOf(id) != -1) {
          //缓存中有，证明已经点过赞了
          res1.data.isZan = true
        } else {
          res1.data.isZan = false
        }
        that.setData({
          trendsItem: res1.data
        })
      })
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
    let {id,status} = e.currentTarget.dataset
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
    let {trendsItem} = that.data
    trendsItem.supports++
    trendsItem.isZan = true

    that.setData({
      trendsItem,
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

  //预览大图
  handelPicTap(e){
    let imgList=this.data.trendsItem.imgIdArr
    let src = e.currentTarget.dataset.src
    wx.previewImage({
      urls: imgList,
      current: src
    })
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