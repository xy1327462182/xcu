// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let {status,skip,limit,_openid} = event
        
  //根据状态查询
  if (status) {
    let res1 = await db.collection('xcu_reward').where({
      status
    }).skip(skip).limit(limit).get()
    return {
      res1,
    }
  }
  if (_openid) {
    let res2 = await db.collection('xcu_reward').where({
      _openid
    }).get()
    return {
      res2,
    }
  }
  

  
}