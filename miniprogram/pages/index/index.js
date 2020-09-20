//获取数据库引用
const db=wx.cloud.database()
var app = getApp()

import {request} from "../../request/index.js";
import {getSetting,openSetting} from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    indexNavList: [],
    weatherMsg: null,
    city: '',
    locationId: '',
    goodsList: [],
    trendsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    //查询轮播图数据
    db.collection("indexSwiper").get()
      .then(res=>{
        this.setData({
          swiperList: res.data
        })
      })
    //查询导航栏数据
    db.collection("indexNav").get()
      .then(res=>{
        this.setData({
          indexNavList: res.data
        })
      })
    //获取地址信息
    wx.getLocation({
      success(res){
        let {latitude,longitude}=res
        //获取城市
        that.getCity(latitude,longitude)
      },
      fail(err){
        console.log(err);
      }
    })
    //获取商品信息
    that.getGoodsDate()
  },
  //获取城市信息
  async getCity(latitude,longitude){
    let that=this
    let key='e10880340dee4e1f8e8a9b0f4c547bfb'
    let res1=await request({
      url: "https://geoapi.heweather.net/v2/city/lookup",
      data: {
        location: longitude+','+latitude,
        key,
      }
    })
    let locationId=res1.data.location[0].id
    let city=res1.data.location[0].adm2
    that.setData({
      city,
      locationId
    })
    that.getWeather(locationId,key)
  },
  //获取实时天气
  async getWeather(location, key){
    let that=this
    let res1=await request({
      url: "https://devapi.heweather.net/v7/weather/now",
      data: {
        location,
        key
      }
    })
    
    that.setData({
      weatherMsg: res1.data.now
    })
  },
  //点击获取天气按钮
  async openSetWea(){
    let that = this
    let res1=await openSetting()
    if (res1.authSetting['scope.userLocation']) {
      //用户同意授权
      wx.getLocation({
        success(res){
          let {latitude,longitude}=res
          //获取城市
          that.getCity(latitude,longitude)
        },
        fail(err){
          console.log(err);
        }
      })
    }
  },
  //获取商品、动态信息
  async getGoodsDate(){
    let that = this
    let res1 = await db.collection('xcu_goods').orderBy('createTime','desc').limit(10).get()
    let goodsList = res1.data
    that.setData({
      goodsList
    })
    wx.stopPullDownRefresh()
    wx.hideLoading()
  },

  //获取动态信息
  async getTrendsData(){
    wx.showLoading({
      title: '拼命加载中',
    })
    let that = this
    let res2 = await db.collection('xcu_trends').orderBy('createTime','desc').limit(10).get()
    let trendsList = res2.data
    that.setData({
      trendsList
    })
    wx.hideLoading()
  },

  //导航栏跳转点击
  handelNavItemTap(e){
    let that = this
    //拿到索引和url 分不同情况跳转
    let {index,url} = e.currentTarget.dataset
    if (index==0) {
      getApp().globalData.urlQuery = {
        nowTabContent: 0
      }
    } else if (index==2) {
      getApp().globalData.urlQuery = {
        nowTabContent: 1
      }
    }
    wx.switchTab({
      url: url,
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
    this.getGoodsDate()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '拼命加载中',
    })
    this.getTrendsData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})