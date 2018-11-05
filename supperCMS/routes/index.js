var express = require('express');
var cookie = require('cookie-parser');
var router = express.Router();
var $mysql   = require("mysql");
var sql = require("../public/javascripts/mysql");      
var $sql = $mysql.createConnection(sql.mysql) 
$sql.connect();
var  sql_cnname = 'SELECT * FROM user_msg where username=';
var usermsg=function(name,fn){
	$sql.query(sql_cnname+'"'+name+'"',function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
       	fn(result);
  })
}
/* GET home page. */
router.get('/index', function(req, res, next) {
	if(!req.cookies.username){
		res.redirect('/login');
	}else{
		usermsg(req.cookies.username,function(result){
			res.render('index', { title: 'CMS',usermsgs:result[0]});
		})
	}
});
router.get('/', function(req, res, next) {
 	if(!req.cookies.username){
		res.redirect('/login');
	}else{
		usermsg(req.cookies.username,function(result){
			res.render('index', { title: 'CMS',usermsgs:result[0]});
		})
	}
});
router.get('/login', function(req, res, next) {
	res.clearCookie('username');
  res.render('login', { title: 'CMS登录' });
});
router.get('/basics', function(req, res, next) {
  if(!req.cookies.username){
		res.redirect('/login');
	}else{
		usermsg(req.cookies.username,function(result){
			res.render('basics', { title: '基本信息',usermsgs:result[0]});
		})
	}
});

module.exports = router;
