// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let _id = event._id
  //删除本数据
  if (_id) {
    await db.collection('xcu_reward').doc(_id).remove()
  }
}