// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let status = event.status
  console.log(status)
  //根据状态查询
  if (status) {
    let res1 = await db.collection('xcu_reward').where({
      status
    }).get()
    return {
      res1,
    }
  }
  

  
}