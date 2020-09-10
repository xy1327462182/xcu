import {chooseImage} from "../../utils/asyncWx.js";
// pages/publishGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: []
  },

  //取消按钮
  cancelHandel(){
    wx.navigateBack({
      delta: 1,
    })
  },

  //添加图片
  async addPics(){
    let that = this
    let {imgList}=this.data
    let len = imgList.length
    let n = 6 - len
    if (n > 0) {
      let res1=await chooseImage({
        count: n,
        sizeType: ['original', 'compressed'],
      })
      let {tempFilePaths}=res1
      
      if (len == 0) {
        imgList=tempFilePaths
      } else {
        imgList = imgList.concat(tempFilePaths)
      }
      that.setData({
        imgList
      })
      console.log(that.data.imgList);
    }
    
  },

  //删除图片
  delImgs(e){
    //获取索引
    let {index}=e.currentTarget.dataset
    let {imgList}=this.data
    imgList.splice(index,1)
    this.setData({
      imgList
    })    
  },  

  //预览大图
  handelPicTap(e){
    let imgList=this.data.imgList
    let src = e.currentTarget.dataset.src
    wx.previewImage({
      urls: imgList,
      current: src
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