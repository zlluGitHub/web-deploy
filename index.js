const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require("fs");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();

//解决刷新页面后 页面404
let history = require('connect-history-api-fallback');
// app.use(history({ verbose: true, index: '/index.html'}));
app.use(history());

// 引入json解析中间件
// 解决上传内容太多失败
let bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// app.use(express.json({limit: '500mb'}));
// path.join(__dirname, 'public') 表示工程路径后面追加 public
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'www')));
app.use(express.static(path.join(__dirname, 'web')));

//解决跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // res.header('X-Powered-By', '3.2.1');
  // res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// 路由引入
app.use('/api/template/chart', require('./routes/template/chart'));
app.use('/api/template/chart/img', require('./routes/template/img'));

app.use('/api/template/component', require('./routes/component/index'));
app.use('/api/template/component/img', require('./routes/component/img'));

app.use('/api/person/user', require('./routes/person/user'));
app.use('/api/person/img', require('./routes/person/img'));

app.use('/api/chart/theme', require('./routes/theme/theme'));
app.use('/api/task', require('./routes/task/task'));
app.use('/api/task/files', require('./routes/task/files'));

app.use('/api/deploy/files', require('./routes/deploy/files'));
app.use('/api/deploy/edition', require('./routes/deploy/edition'));
app.use('/api/deploy/auto', require('./routes/deploy/autoEdition'));
app.use('/api/deploy/git', require('./routes/deploy/git'));
app.use('/api/deploy/port', require('./routes/deploy/port'));

app.use('/api/service/operation', require('./routes/service/operation'));

app.use('/api/project/handle', require('./routes/project/handle'));
app.use('/api/project/tool', require('./routes/project/tool'));
app.use('/api/project/img', require('./routes/project/img'));
app.use('/api/project/feedback', require('./routes/project/feedback'));

// 第三方登录
app.use('/api/person/oauth', require('./routes/person/oauth'));

// app.use('/users', usersRouter);
// app.use('/upload', uploadRouter);
// app.use('/journal', journalRouter);
// app.use('/words', wordsRouter);
// app.use('/chart', chFileRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//读取配置文件
fs.readFile(path.resolve(__dirname, "./config.json"), 'utf8', function (err, data) {
  if (!err) {
    let config = JSON.parse(data);
    // 连接数据库
    const mongoose = require('mongoose');
    //mongodb://user:password@wry520.cn:27017/SimpleDesign
    // mongoose.connect("mongodb://10.0.82.131:27017/SimpleDesign", { useNewUrlParser: true }, err => {
    // mongoose.connect("mongodb://10.0.86.17:27017/SimpleDesign", {
    //   useNewUrlParser: true,
    //   // useUnifiedTopology: true     //这个即是报的警告
    // }, err => {
    // mongoose.connect("mongodb://10.0.88.46:27017/SimpleDesign", { useNewUrlParser: true}, err => {
    // mongoose.connect("mongodb://10.0.86.17:27017/SimpleDesign", { useNewUrlParser: true}, err => {
    // mongoose.connect("mongodb://localhost:27017/SimpleDesign", { useNewUrlParser: true }, err => {
    // mongoose.connect("mongodb://localhost:13149/SimpleDesign", { useNewUrlParser: true }, err => {
    mongoose.connect(`mongodb://${config.database.ip}:${config.database.port}/SimpleDesign`, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
      if (err) {
        console.log('Connection Error:' + err);
      } else {
        console.log('数据库连接成功!');
      }
    })
  } else {
    console.log(err);
  }
});

module.exports = app;
