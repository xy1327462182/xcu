import {chooseImage,uploadFile} from "../../utils/asyncWx.js";
import {formatDate} from "../../utils/formatDate.js";
let db = wx.cloud.database()
// pages/publishTrends/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorAvatar: '',
    authorNickName: '',
    trendsInfoTxt: '',
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
    let n = 9 - len
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
    }
  },
  //预览图片
  handelPicTap(e){
    let imgList=this.data.imgList
    let src = e.currentTarget.dataset.src
    wx.previewImage({
      urls: imgList,
      current: src
    })
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

  //文本域失去焦点
  getTextVal(e){
    let trendsInfoTxt=e.detail.value
    this.setData({
      trendsInfoTxt
    })
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

  //发布
  async publish(){
    let that = this
    if (!that.isLogin()) {
      return 
    }
    let {trendsInfoTxt,imgList1} = that.data
    if (!trendsInfoTxt) {
      await wx.showToast({
        title: '请填写动态内容哦',
        icon: 'none',
      })
      return
    }
    wx.showLoading({
      title: '拼命上传中',
    })
    let data = this.data
    let {imgList} = data
    let imgIdArr = []
    //处理商品图片
    for (let i=0;i<imgList.length;i++) {
      let randomNum = parseInt(Math.random() * 1000)
      let res = await uploadFile({
        cloudPath: 'xcu/' + 'trendsImages/' + Date.now() + randomNum + '.jpg',
        filePath: imgList[i],
        config: {
          env: 'yang-g4cqy'
        }
      })
      imgIdArr.push(res.fileID)
    } 
    //获取作者openid
    let authorOpenId=wx.getStorageSync('userLogin')._openid
    
    await wx.cloud.callFunction({
      name: 'addTrends',
      data: {
        trendsInfoTxt: data.trendsInfoTxt,
        imgIdArr: imgIdArr,
        authorOpenId: authorOpenId,
        authorAvator: data.authorAvatar,
        authorNickName: data.authorNickName,
        supports: 0,
        createTime: formatDate(Date.now())
      },
    })
    wx.hideLoading()
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      success(){
        wx.switchTab({
          url: '/pages/discover/index',
        })
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
    let that = this
    //获取当前用户作者信息
    wx.getUserInfo({
      success: (res1) =>{
        that.setData({
          authorAvatar: res1.userInfo.avatarUrl,
          authorNickName: res1.userInfo.nickName
        })
      }
    })
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