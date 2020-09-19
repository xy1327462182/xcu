// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database()
let _=db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let {id,supports} = event
  if (supports) {
    //操作点赞
    return await db.collection('xcu_trends').doc(id).update({
      data: {
        supports: _.inc(1)
      }
    })
  }

  return {
    event,
  }
}