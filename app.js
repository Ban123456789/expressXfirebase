var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var fireData = admin.database();
var fireDataPath = fireData.ref('todos');
  // console.log(fireData);
// * 在後端都建議用 once 去做監聽，因為就算在後端用 on 的話，前端也不會監聽
  // fireData.ref('todos').once('value', function(data){
  //     console.log(data.val());
  // });
// todo 後端作業
// todo 從資料庫撈取資料
  app.get('/', function(req, res){
    fireDataPath.once('value', function(datas){
      // console.log(datas.val());
      res.render('index',{
        'todoList': datas.val()
      });
    });
  });

// todo 新增資料到資料庫
app.post('/addContent', function(req, res){
  let addPath = fireDataPath.push();
  let txt = req.body.content;
    addPath.set({'content':txt}).then(function(){
      fireDataPath.once('value', function(items){
        res.send(
          {
          'success':true,
          'content':items.val(),
          'message':'POST成功'
          }
        );
      });
    });
});

// todo 刪除資料庫資料
app.post('/removeData', function(req, res){
  let id = req.body.id;
  fireDataPath.child(id).remove().then(function(){
    fireDataPath.once('value', function(items){
      res.send(
        {
          'success':true,
          'result':items.val(),
          'message':'刪除成功'
        }
      );
    })
  });

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
