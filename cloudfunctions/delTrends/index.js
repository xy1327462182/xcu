// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const _id = event._id
  const fileIDs = event.fileIDs
  //根据id删除动态数据
  if (_id) {
    await db.collection('xcu_trends').doc(_id).remove()
    const result = await cloud.deleteFile({
      fileList: fileIDs,
    })
    return result.fileList
  }
}