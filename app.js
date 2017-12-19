'use strict'

const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')


const db = 'mongodb://120.78.221.132:27017/main'

/**
 * mongoose连接数据库
 * @type {[type]}
 */
mongoose.Promise = require('bluebird')
mongoose.connect(db)
mongoose.connection.on('connected',(err,res) => {
  if(err) console.log('链接失败');
  console.log('链接成功');
})

/**
 * 获取数据库表对应的js对象所在的路径
 * @type {[type]}
 */
const models_path = path.join(__dirname, '/app/models')


/**
 * 已递归的形式，读取models文件夹下的js模型文件，并require
 * @param  {[type]} modelPath [description]
 * @return {[type]}           [description]
 */
var walk = function(modelPath) {
  fs
    .readdirSync(modelPath)
    .forEach(function(file) {
      var filePath = path.join(modelPath, '/' + file)
      var stat = fs.statSync(filePath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(filePath)
        }
      }
      else if (stat.isDirectory()) {
        walk(filePath)
      }
    })
}
walk(models_path)

require('babel-register')
const Koa = require('koa')
const logger = require('koa-logger')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const app = new Koa()

app.keys = ['zhangivon']
app.use(logger())
app.use(session(app))
app.use(bodyParser({limit:'10mb'}))

// 静态资源静态资源路径后端上传
app.use(koaStatic(path.join( __dirname,  './static')));
// 前台静态文件
app.use(koaStatic(path.join( __dirname,  './views')));

/**
 * 使用路由转发请求
 * @type {[type]}
 */
const router = require('./config/router')()

app
  .use(router.routes())
  .use(router.allowedMethods());



app.listen(1234)
console.log('app started at port 1234...');