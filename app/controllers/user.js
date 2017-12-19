'use strict'

var xss = require('xss')
var mongoose =  require('mongoose')
var User = mongoose.model('User')
var uuid = require('uuid')
var validator = require('validator');
// var userHelper = require('../dbhelper/userHelper')
import userHelper from '../dbhelper/userHelper'

/**
 * 注册新用户
 * @param {Function} next          [description]
 * @yield {[type]}   [description]
 */
exports.signup = async (ctx, next) => {
	var phoneNumber = xss(ctx.request.body.phoneNumber.trim())
	var user = await User.findOne({
	  phoneNumber: phoneNumber
	}).exec()
  console.log(user)
	
	var verifyCode = Math.floor(Math.random()*10000+1)
  console.log(phoneNumber)
	if (!user) {
	  var accessToken = uuid.v4()

	  user = new User({
	    nickname: '测试用户',
	    avatar: 'http://upload-images.jianshu.io/upload_images/5307186-eda1b28e54a4d48e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
	    phoneNumber: xss(phoneNumber),
	    verifyCode: verifyCode,
	    accessToken: accessToken
	  })
	}
	else {
	  user.verifyCode = verifyCode
	}

	try {
    user = await user.save()
    ctx.body = {
      success: true
    }
  }
  catch (e) {
    ctx.body = {
      success: false
    }

    return next
  }

}

/**
 * 更新用户信息操作
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.update = async (ctx, next) => {
  var body = ctx.request.body
  var user = ctx.session.user
  var fields = 'avatar,gender,age,nickname,breed'.split(',')

  fields.forEach(function(field) {
    if (body[field]) {
      user[field] = xss(body[field].trim())
    }
  })

  user = await user.save()

  ctx.body = {
    success: true,
    data: {
      nickname: user.nickname,
      accessToken: user.accessToken,
      avatar: user.avatar,
      age: user.age,
      breed: user.breed,
      gender: user.gender,
      _id: user._id
    }
  }
}



/**
 * 后台用户接口
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */

exports.users = async (ctx, next) => {
  var data = await userHelper.findAllUsers()
  // var obj = await userHelper.findByPhoneNumber({phoneNumber : '13525584568'})
  // console.log('obj=====================================>'+obj)
  
  ctx.body = {
    code:1,
    msg: '获取成功',
    data
  }
}

/**
 * 修改用户密码接口
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.editUser = async (ctx,next) => {
  let body = ctx.request.body;
  let resp = {};

  if( !validator.isAlphanumeric(body.name) || validator.isEmpty(body.name)||
    !validator.isAlphanumeric(body.pwd) ||validator.isEmpty(body.pwd)){
      resp = {code:0,msg: '请输入正确的用户名和密码',data:{}}
  }else{
    // 更新用户到用户数据库中
  await User.updateOne({},body)
            .then( res => resp = {code:1,msg: '修改成功',data:{}}
             ).catch( e => resp = {code:0,msg: '修改失败',data:{}} );
  }
  ctx.body = resp;
  return next;
}

/**
 * 用户后台登录接口
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.userLogin = async (ctx,next) => {
  let body = ctx.request.body;
  let resp = {};

  if( !validator.isAlphanumeric(body.name) || validator.isEmpty(body.name)||
    !validator.isAlphanumeric(body.pwd) ||validator.isEmpty(body.pwd)){
      resp = {code:0,msg: '请输入正确的用户名和密码',data:{}}
  }else{
    // 更新用户到用户数据库中
      let userInfo = await User.find({'name':body.name,'pwd':body.pwd});
      resp = userInfo.length ? {code:1,msg: '登录成功',data:{} } : {code:0,msg: '账号或者密码错误',data:{}}
  }
  ctx.body = resp;
  return next;
}



// exports.addUser = async (ctx, next) => {
//   var user = new User({
//       nickname: '测试用户',
//       avatar: 'http://ip.example.com/u/xxx.png',
//       phoneNumber: xss('13800138000'),
//       verifyCode: '5896',
//       accessToken: uuid.v4()
//     })
//   var user2 =  await userHelper.addUser(user)
//   if(user2){
//     ctx.body = {
//       success: true,
//       data : user2
//     }
//   }
// }
// exports.deleteUser = async (ctx, next) => {
//   const phoneNumber = xss(ctx.request.body.phoneNumber.trim())
//   console.log(phoneNumber)
//   var data  = await userHelper.deleteUser({phoneNumber})
//   ctx.body = {
//     success: true,
//     data
//   }
// }