// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let {_openid,collectionList} = event
  console.log(_openid)
  console.log(collectionList)
  await db.collection('xcu_userInfo').where({
    _openid
  }).update({
    data: {
      collectionList
    }
  })
  return {
    _openid,
    collectionList
  }
}