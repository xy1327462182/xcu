import {request} from "../../request/index.js";
// pages/weatherPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    daily: [],
    city: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let locationId=options.locationId
    let city=options.city
    let key='e10880340dee4e1f8e8a9b0f4c547bfb'
    this.getWeather(locationId, key, city)
  },
  //获取实时天气
  async getWeather(location, key, city){
    let that = this
    let daily = []
    let res1 = await request({
      url: "https://devapi.heweather.net/v7/weather/3d",
      data: {
        location,
        key
      }
    })

    for (let i = 0;i < res1.data.daily.length; i++) {
      daily[i] = {
        fxDate: res1.data.daily[i].fxDate,
        textDay: res1.data.daily[i].textDay,
        textNight: res1.data.daily[i].textNight,
        tempMin: res1.data.daily[i].tempMin,
        tempMax: res1.data.daily[i].tempMax,
      }
      if (i==0) {
        daily[i].windDirDay = res1.data.daily[i].windDirDay
        daily[i].precip = res1.data.daily[i].precip
        daily[i].humidity = res1.data.daily[i].humidity
        daily[i].windScaleDay = res1.data.daily[i].windScaleDay
        daily[i].pressure = res1.data.daily[i].pressure
      }
    }

    
    that.setData({
      daily,
      city,
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