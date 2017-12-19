'use strict'

const Router = require('koa-router')
const User = require('../app/controllers/user')
const App = require('../app/controllers/app')

module.exports = function(){
	var router = new Router({
    prefix: '/api'
  })

  // user
  // router.post('/u/signup', App.hasBody, User.signup)
  // router.post('/u/update', App.hasBody, App.hasToken, User.update)

  // DB Interface test
  router.get('/user/users',User.users)
  // router.post('/test/user/add',User.addUser)
  // router.post('/test/user/delete',User.deleteUser)
  // 修改用户信息接口
  router.post('/user/modify',User.editUser)
  // 登陆接口
  router.post('/user/login',User.userLogin)
  // 上传图片接口
  router.post('/uploadFile',App.uploadImage)

  return router
}