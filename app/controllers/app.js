'use strict'

// 用于封装controllers的公共方法

var mongoose = require('mongoose')
var uuid = require('uuid')
var User = mongoose.model('User')
var uploadFile = require('../service/upload.js').uploadFile;
var path = require('path');

exports.hasBody = async (ctx, next) => {
  var body = ctx.request.body || {}
  // console.log(this.query.phonenumber)
  console.log(body)

  if (Object.keys(body).length === 0) {
    ctx.body = {
      success: false,
      err: '某参数缺失'
    }

    return next
  }

  await next()
}

// 检验token
exports.hasToken = async (ctx, next) => {
  var accessToken = ctx.query.accessToken

  if (!accessToken) {
    accessToken = ctx.request.body.accessToken
  }

  if (!accessToken) {
    ctx.body = {
      success: false,
      err: '令牌失效'
    }

    return next
  }

  var user = await User.findOne({
    accessToken: accessToken
  })
  .exec()

  if (!user) {
    ctx.body = {
      success: false,
      err: '用户没登陆'
    }

    return next
  }

  ctx.session = ctx.session || {}
  ctx.session.user = user

  await next()
}

// 上传图片
exports.uploadImage = async (ctx,next) => {
  // 上传文件请求处理
    let result = { code: 0 }
    let serverFilePath = path.join( __dirname, '../../static' )

    // 上传文件事件
    result = await uploadFile( ctx, {
      fileType: 'uploadImage',
      path: serverFilePath
    })
    ctx.body = result
}