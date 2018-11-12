var express = require('express');
var cookie = require('cookie-parser');
var router = express.Router();
var ws = require("ws").Server;
var server = new ws({hostname:'www.wangxd.work',port: 1314});
var $mysql = require("mysql");
var sql = require("../public/javascripts/mysql");
var $sql = $mysql.createConnection(sql.mysql)
$sql.connect();
//获取数据
var sql_nav = 'SELECT * FROM nav';
var sql_cnname = 'SELECT * FROM user_msg where username=';
var sqlData = function(sqls, fn) {
	$sql.query(sqls, function(err, result) {
		if(err) {
			console.log('[SELECT ERROR] - ', err.message);
			return;
		}
		fn(result);
	});
}
//参数
var publics = {
	render:[
		{path:'/',param:{title:'CMS'}},
		{path:'/index',param:{title:'CMS'}},
		{path:'/basics',param:{title:'基本信息'}},
		{path:'/navMonitor',param:{title:'菜单设置',href: 'navMonitor'}}
	]
}
//登录
router.get('/login', function(req, res, next) {
	res.clearCookie('username');
	res.render('cmsadmin/login', {
		title: 'CMS登录',
		layout: 'cmsadmin/layout',
	});
});

//路由初始化
publics.render.forEach(function(value,index,array){
    renders(value.path,value.param);
})
//执行方法
function renders(path,objs) {
	router.get(path, function(req, res, next) {
		if(!req.cookies.username) {
			res.redirect('/login');
		} else {
			sqlData(sql_cnname+'"'+req.cookies.username+'"', function(result) {
				var obj_ = {layout: 'cmsadmin/layout',usermsgs: result[0]};
				mergeJSON(objs,obj_)
				res.render('cmsadmin'+path,obj_);
			})
		}
	});
}
// 遇到相同元素级属性，以后者（main）为准
// 不返还新Object，而是main改变
function mergeJSON (minor, main) {
  for (var key in minor) {
    if (main[key] === undefined) {  // 不冲突的，直接赋值
      main[key] = minor[key];
      continue;
    }
    // 冲突了，如果是Object，看看有么有不冲突的属性
    // 不是Object 则以main为主，忽略即可。故不需要else
    if (isJSON(minor[key])) {
      // arguments.callee 递归调用，并且与函数名解耦
      arguments.callee(minor[key], main[key]); 
    }
  }
}

// 附上工具
function isJSON(target) {
  return typeof target == "object" && target.constructor == Object;
}

module.exports = router;