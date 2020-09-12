let db = wx.cloud.database()
// pages/goodsDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsMsg: {},
    avatarUrl: '',
    nickName: '',
    value: '',
    comments: [],
    isZan: false,
    isCollection: false
  },
  //获取数据
  async getGoodsData(id){
    wx.showLoading({
      title: '拼命加载中',
    })
    let that=this
    //查找商品数据
    let res=await db.collection('xcu_goods').doc(id).get()
    let goodsMsg = res.data
    //获得该商品的作者openid
    let uid=goodsMsg.userInfo.openId
    //获取作者信息
    let authorMsg = await db.collection('xcu_userInfo').where({
      _openid: uid
    }).get()
    let {avatarUrl,nickName} = authorMsg.data[0]
    //获取商品的评论信息
    let comments = goodsMsg.comments || []
    that.setData({
      goodsMsg,
      avatarUrl,
      nickName,
      comments
    })
    wx.hideLoading()
  },

  //输入框失去焦点
  iptBlur(e){
    let {value}=e.detail
    this.setData({
      value
    })
  },
  //添加评论按钮
  async handelAddTap(){
    let that = this
    //获取输入框的值和旧评论数组
    let {value,comments}=this.data
    if (value) {
      //获取评论者信息
      wx.getUserInfo({
        success: async function(res){
          //向评论数组添加数据
          let obj={
            cAuthor: {
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl
            },
            cComment: value
          }
          comments.unshift(obj)
          // setData 输入框置空
          that.setData({
            comments,
            value: ''
          })
          //提示评论成功
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            mask: true,
            duration: 500
          })

          //获取商品id
          let {_id}=that.data.goodsMsg
          //更新数据库
          await wx.cloud.callFunction({
            name: 'updateGoods',
            data: {
              _id,
              comments
            }
          })
          
        }
      })
    }
  },

  //点赞
  async handelSupport(){
    let {isZan,goodsMsg} = this.data
    if (!isZan) {
      let supports = goodsMsg.supports || 0
      let _id=goodsMsg._id
      supports++
      this.setData({
        isZan: true
      })
      wx.showToast({
        title: '感谢支持',
        icon: 'success'
      })
      //调用云函数，更新数据库
      await wx.cloud.callFunction({
        name: 'updateGoods',
        data: {
          _id,
          supports
        }
      })
      //将本次点赞过的商品id存入缓存 防止用户多次点赞
      let goodsSupports=wx.getStorageSync('goodsSupports') || []
      goodsSupports.unshift(_id)
      wx.setStorageSync('goodsSupports', goodsSupports)
    }
  },

  //收藏
  async handelCollection(){
    let {isCollection} = this.data
    let openid=wx.getStorageSync('userLogin')._openid
    if (!isCollection) {
      //要收藏
      // await wx.cloud.callFunction({
      //   name: 'updateUserInfo',
      //   data: {
      //     openid
      //   }
      // })
    } else {
      //要取消收藏
    }


    isCollection = !isCollection
    this.setData({
      isCollection
    })
    //收藏夹增加
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let id=options.id
    this.getGoodsData(id)
    let goodsSupports = wx.getStorageSync('goodsSupports')
    if (goodsSupports) {
      goodsSupports.forEach(element => {
        if (element == id) {
          that.setData({
            isZan: true
          })
        }
      })
    }
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