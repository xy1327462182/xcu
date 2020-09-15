import {chooseImage,uploadFile} from "../../utils/asyncWx.js";
let db = wx.cloud.database()
// pages/publishGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    addressArr: [],
    goodsInfoTxt: '',
    goodsPrice: 0,
    animationTools: '',
    animationMask: '',
    noteIpt: '',
    notesList: []
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

  //收货地址
  bindAddressChange(e){
    let addressArr = e.detail.value
    this.setData({
      addressArr
    })
  },

  //价格输入
  priceIpt(e){
    let goodsPrice = e.detail.value - 0
    this.setData({
      goodsPrice
    })
  },

  //处理标签点击  开启遮罩层和标签工具栏
  openTools(){
    let animationTools = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    animationTools.bottom('0').step()
    this.setData({
      animationTools: animationTools.export()
    })

    let animationMask = wx.createAnimation({
      duration: 10,
      timingFunction: 'ease',
    })
    animationMask.top('0').step()
    this.setData({
      animationMask: animationMask.export()
    })
  },

  //点击遮罩层
  handelMaskTap(){
    let animationMask = wx.createAnimation({
      duration: 10,
      timingFunction: 'ease',
    })
    animationMask.top('100%').step()
    this.setData({
      animationMask: animationMask.export()
    })

    let animationTools = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    animationTools.bottom('-100%').step()
    this.setData({
      animationTools: animationTools.export()
    })
  },

  //输入框输入
  handelInput(e){
    let noteIpt=e.detail.value
    this.setData({
      noteIpt 
    })
  },

  //文本域失去焦点 获取value
  getTextVal(e){
    let goodsInfoTxt=e.detail.value
    this.setData({
      goodsInfoTxt
    })
  },

  //添加标签
  handelAddNotes(){
    let inner = this.data.noteIpt
    if (inner.length > 0) {
      let {notesList} = this.data
      notesList.push(inner)
      this.setData({
        notesList,
        noteIpt: ''
      })
    }
  },

  //删除标签
  delNotes(e){
    let {index}=e.currentTarget.dataset
    let {notesList}=this.data
    notesList.splice(index,1)
    this.setData({
      notesList
    })
  },

  //发布商品
  async publish(){
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
        cloudPath: 'xcu/' + 'goodsImages/' + Date.now() + randomNum + '.jpg',
        filePath: imgList[i],
        config: {
          env: 'yang-g4cqy'
        }
      })
      imgIdArr.push(res.fileID)
    } 
    //获取作者信息
    let authorOpenId=wx.getStorageSync('userLogin')._openid
    let authorMsg=await db.collection('xcu_userInfo').where({
      _openid: authorOpenId
    }).get()
    
    await wx.cloud.callFunction({
      name: 'addGoods',
      data: {
        goodsInfoTxt: data.goodsInfoTxt,
        imgIdArr,
        addressArr: data.addressArr,
        goodsPrice: data.goodsPrice,
        notesList: data.notesList,
        authorOpenId: authorOpenId,
        authorAvator: authorMsg.data[0].avatarUrl,
        authorNickName: authorMsg.data[0].nickName,
        supports: 0,
        num: 0,
        status: "上架",
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