//记录同时发送请求的次数
let ajaxTimes = 0

export const request=(params)=>{
  //每调用一次 加1
  ajaxTimes++

  //显示加载中
  wx.showLoading({
    title: '玩命加载中',
    mask: true
  })

  return new Promise((resolve, reject)=>{
    wx.request({
      ...params,
      success:(res)=>{
        resolve(res)
      },
      fail(err){
        reject(err)
      },
      complete(){
        ajaxTimes--

        //隐藏加载中
        if (ajaxTimes === 0) {
          wx.hideLoading()
        }
      }
    })
  })
}