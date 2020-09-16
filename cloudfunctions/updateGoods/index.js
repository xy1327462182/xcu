// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

let db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let {_id,comments,supports,status}=event
  //评论
  if (comments) {
    await db.collection('xcu_goods').doc(_id).update({
      data: {
        comments
      }
    })
  }
  //点赞
  if (supports) {
    await db.collection('xcu_goods').doc(_id).update({
      data: {
        supports
      }
    })
  }
  //更改销售状态
  if (status) {
    await db.collection('xcu_goods').doc(_id).update({
      data: {
        status
      }
    })
  }
  return {
    event
  }
}