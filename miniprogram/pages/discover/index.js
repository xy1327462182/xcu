// pages/discover/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disTabsList: [
      {
        name: "好物",
        isActive: false,
        id:0
      },
      {
        name: "动态",
        isActive: true,
        id:1
      },
      {
        name: "好书",
        isActive: false,
        id:2
      }
    ]
  },

  handelTabChange(e){
    let {id}=e.currentTarget.dataset
    let {disTabsList}=this.data
    disTabsList.forEach(v=>{
      v.id === id ? v.isActive=true:v.isActive=false
    })
    this.setData({
      disTabsList
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