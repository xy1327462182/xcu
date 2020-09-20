import {formatDate} from "../../utils/formatDate.js";
let db = wx.cloud.database()
// pages/myGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      {
        id: 0,
        name: '全部商品',
        isActive: true
      },
      {
        id: 1,
        name: '已售商品',
        isActive: false
      },
      {
        id: 2,
        name: '未售商品',
        isActive: false
      },
    ],
    nowIndex: 0,
    goodsList: []
  },
  //处理tab切换
  handelTab(e){
    let {index} = e.currentTarget.dataset
    let {tabList} = this.data
    tabList.forEach((v,n)=>{
      index == n ? v.isActive=true : v.isActive=false
    })
    this.setData({
      tabList,
      nowIndex: index
    })
    this.getGoodsDate(index)
  },
  //获取商品数据
  async getGoodsDate(index){
    let that = this
    //index = 0 全部商品
    //index = 1 已售商品
    //index = 2 未售商品
    wx.showLoading({
      title: '拼命加载中',
    })
    //获取当前用户id信息
    let _openid = wx.getStorageSync('userLogin')._openid
    //查全部商品
    if (index==0) {
      let res1 = await db.collection('xcu_goods').orderBy('createTime','desc').where({
        authorOpenId: _openid
      }).get()
      let goodsList = res1.data
      that.setData({
        goodsList
      })
    } else if (index==1) {
      let res2 = await db.collection('xcu_goods').orderBy('createTime','desc').where({
        authorOpenId: _openid,
        status: '已售'
      }).get()
      let goodsList = res2.data
      that.setData({
        goodsList
      })
    } else if (index==2) {
      let res3 = await db.collection('xcu_goods').orderBy('createTime','desc').where({
        authorOpenId: _openid,
        status: '上架'
      }).get()
      let goodsList = res3.data
      that.setData({
        goodsList
      })
    }
    wx.hideLoading()

  },

  //删除商品
  async handelDelGoods(e){
    let that = this
    wx.showLoading({
      title: '删除中',
    })
    //获取商品id和索引
    let {id,indexnum} = e.currentTarget.dataset
    //获取当前商品图片数组
    console.log(id,indexnum)
    
    let fileIDs = that.data.goodsList[indexnum].imgIdArr
    console.log(fileIDs)
    //删除数据
    await wx.cloud.callFunction({
      name: "delGoods",
      data: {
        _id: id,
        fileIDs
      }
    })
    wx.hideLoading()
    
    //重新获取数据
    let index = this.data.nowIndex
    this.getGoodsDate(index)
    await wx.showToast({
      title: '删除成功',
      icon: 'success'
    })
  },

  //改卖出状态
  async handelSold(e){
    wx.showLoading({
      title: '更改中',
    })
    //获取商品id
    let _id = e.currentTarget.dataset.id
    //更新数据 状态改为已售
    await wx.cloud.callFunction({
      name: "updateGoods",
      data: {
        _id,
        status: '已售',
      }
    })
    wx.hideLoading()
    
    //重新获取数据
    let index = this.data.nowIndex
    this.getGoodsDate(index)
    await wx.showToast({
      title: '售出成功',
      icon: 'success'
    })
  },

  async handelSell(e){
    wx.showLoading({
      title: '上架中',
    })
    //获取商品id
    let _id = e.currentTarget.dataset.id
    //更新数据 状态改为上架
    await wx.cloud.callFunction({
      name: "updateGoods",
      data: {
        _id,
        status: '上架',
      }
    })
    await wx.hideLoading()
    
    //重新获取数据
    let index = this.data.nowIndex
    this.getGoodsDate(index)
    await wx.showToast({
      title: '上架成功',
      icon: 'success',
      mask: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {tabList} = this.data
    let index = 0
    tabList.forEach((v,n)=>{
      if (v.isActive) {
        index = v.id
      }
    })
    this.getGoodsDate(index)
    this.setData({
      nowIndex: index
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