// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let skip = event.skip
  let num = event.num
  
  if (num) {
    //拼接查询
    let res = await db.collection('xcu_trends').orderBy('createTime','desc').skip(skip).limit(num).get()
    return res
  }
  
}