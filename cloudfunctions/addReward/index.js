// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let {data} = event
  await db.collection('xcu_reward').add({
    data
  })
  return {
    event,
  }
}