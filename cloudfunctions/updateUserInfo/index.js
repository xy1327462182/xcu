// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let {_openid,collectionList,newOrder} = event
  console.log(_openid,collectionList)

  //更新收藏夹数据
  if (collectionList) {
    await db.collection('xcu_userInfo').where({
      _openid
    }).update({
      data: {
        collectionList
      }
    })
  }
  //新建订单信心
  if (newOrder) {
    await db.collection('xcu_userInfo').where({
      _openid
    }).update({
      data: {
        myOrder: _.unshift(newOrder)
      }
    })
  }
  
  return {
    _openid,
  }
}