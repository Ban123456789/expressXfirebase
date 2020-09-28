var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// todo 加入 firebase 的 API
var admin = require("firebase-admin");

var serviceAccount = require("./expressxfirebase-firebase-adminsdk-6b47x-3a95e624f2.json");
const { title } = require('process');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://expressxfirebase.firebaseio.com"
});
var fireData = admin.database();
var fireDataPath = fireData.ref('todos');
  // console.log(fireData);
// * 在後端都建議用 once 去做監聽，因為就算在後端用 on 的話，前端也不會監聽
  // fireData.ref('todos').once('value', function(data){
  //     console.log(data.val());
  // });
// todo 新增資料到後資料庫
  // fireDataPath.set({'content':'wqer'}).then(function(){
  //     fireDataPath.once('value', function(data){
  //         console.log(data.val());
  //     })
  // });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// todo 從資料庫抓取資料再渲染網頁
app.get('/', function(req, res){
  fireData.ref('todos').once('value', function(data){
    let dataTitle = data.val();
    let qwe = dataTitle.title;
      res.render("index",{"qwe":qwe});
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
