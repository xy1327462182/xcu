/**
 * 将wx原生api进行promise化封装
 */
export const request=(options)=>{
  return new Promise((resolve, reject)=>{
    wx.request({
      ...options, 
      success: res=>{
        resolve(res)
      },
      error: err=>{
        reject(err)
      }
    })
  })
}


export const getSetting=()=>{
  return new Promise((resolve, reject)=>{
    wx.getSetting({
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const openSetting=()=>{
  return new Promise((resolve, reject)=>{
    wx.openSetting({
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}


export const showModal=({content})=>{
  return new Promise((resolve, reject)=>{
    wx.showModal({
      title: "提示",
      content: content,
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const showToast=({title})=>{
  return new Promise((resolve, reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}

export const chooseImage=(data)=>{
  return new Promise((resolve, reject)=>{
    wx.chooseImage({
      ...data,
      success(res){
        resolve(res)
      },
      fail(err){
        reject(err)
      }
    })
  })
}