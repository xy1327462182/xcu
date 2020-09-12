// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

let db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let {_id,comments,supports}=event
  if (comments) {
    await db.collection('xcu_goods').doc(_id).update({
      data: {
        comments
      }
    })
  }

  if (supports) {
    await db.collection('xcu_goods').doc(_id).update({
      data: {
        supports
      }
    })
  }
  return {
    event
  }
}