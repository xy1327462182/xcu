let db = wx.cloud.database()
// pages/myTrends/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trendsList:[],
    _openid: ''
  },

  async getTrendsData(_openid){
    let res1 = await db.collection('xcu_trends').where({
      authorOpenId: _openid
    }).get()
    let trendsList = res1.data.reverse()
    this.setData({
      trendsList
    })
  },

  //删除
  async handelDelTrends(e){
    let that = this
    //获取索引和id
    let {id}=e.currentTarget.dataset
    let res1 = await wx.showModal({
      title: '提示',
      content: '确定删除吗？',
    })
    if (res1.confirm) {
      //确定
      wx.showLoading({
        title: '删除中',
        mask: true
      })
      //删除数据库中的数据
      await wx.cloud.callFunction({
        name: "delTrends",
        data: {
          _id: id
        }
      })
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        mask: true,
        success: ()=>{
          that.getTrendsData(that.data._openid)
        }
      })
    } else {
      //取消
    }
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _openid = options.id
    this.setData({
      _openid
    })
    //查询数据
    this.getTrendsData(_openid)
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