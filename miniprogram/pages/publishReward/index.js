// pages/publishReward/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    storeName: '',
    station: '',
    salary: '',
    work_hours: '',
    requirements: '',
    workAddress: '',
    contact: ''
  },

  radioChange(e){
    let type = e.detail.value
    this.setData({
      type
    })
  },

  handelStoreName(e){
    let storeName = e.detail.value
    this.setData({
      storeName
    })
  },
  handelStation(e){
    let station = e.detail.value
    this.setData({
      station
    })
  },
  handelSalary(e){
    let salary = e.detail.value
    this.setData({
      salary
    })
  },
  handelWorkHours(e){
    let work_hours = e.detail.value
    this.setData({
      work_hours
    })
  },
  handelRequirements(e){
    let requirements = e.detail.value
    this.setData({
      requirements
    })
  },
  handelWorkAddress(e){
    let workAddress = e.detail.value
    this.setData({
      workAddress
    })
  },
  handelContact(e){
    let contact = e.detail.value
    this.setData({
      contact
    })
  },
  async publishReward(){
    let that = this
    let data = this.data
    //过滤空表单
    for (let key in data) {
      if (!data[key]) {
        wx.showToast({
          title: '请补全信息',
          icon: 'none',
          mask: true
        })
        return
      }
    }
    wx.showLoading({
      title: '拼命上传中',
    })
    data.status = '上架'
    //获取作者信息
    let _openid = wx.getStorageSync('userLogin')._openid
    await wx.getUserInfo({
      success: function(res1) {
        data.avatarUrl = res1.userInfo.avatarUrl,
        data.nickName = res1.userInfo.nickName,
        data._openid = _openid
        //添加到数据库
        that.addReward(data)
        
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        })
        that.setData({
          type: "",
          storeName: '',
          station: '',
          salary: '',
          work_hours: '',
          requirements: '',
          workAddress: '',
          contact: ''
        })
        wx.switchTab({
          url: '/pages/reward/index',
        })
      }
    })
  },
  async addReward(data){
    await wx.cloud.callFunction({
      name: "addReward",
      data: {
        data
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