var express = require('express');
const { route } = require('.');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  // console.log(req.cookies);

  // res.cookie('name','Mary',{
  //   maxAge:10000,
  //   path: '/users',
  //   httpOnly: true,
  //   secure: false //true 的話就不會顯示在 cookie 上
  // });
  res.render('users', {
    'name': req.session.username,
    "letter": req.session.email
  });
  console.log(req.session);
});

router.post('/list', function(req, res){
  req.session.username = req.body.username;
  req.session.email = req.body.email;
  res.redirect('/users');
});

module.exports = router;
