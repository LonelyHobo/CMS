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
		{path:'/cmsadmin/',param:{title:'CMS'}},
		{path:'/cmsadmin/index',param:{title:'CMS'}},
		{path:'/cmsadmin/basics',param:{title:'基本信息'}},
		{path:'/cmsadmin/navMonitor',param:{title:'菜单设置',href: 'navMonitor'}},
		{path:'/cmsadmin/news',param:{title:'新闻管理'}},
		{path:'/cmsadmin/newsDetails',param:{title:'文章管理'}},
	],
    webrender:[
        {path:'/',param:{title:'HOME',thispage:'home'}},
	]
}
//登录
router.get('/cmsadmin/login', function(req, res, next) {
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
publics.webrender.forEach(function(value,index,array){
    webrenders(value.path,value.param);
})
//执行方法
function renders(path,objs) {
	router.get(path, function(req, res, next) {
		if(!req.cookies.username) {
			res.redirect('/cmsadmin/login');
		} else {
			sqlData(sql_cnname+'"'+req.cookies.username+'"', function(result) {
				var obj_ = {layout: 'cmsadmin/layout',usermsgs: result[0]};
				mergeJSON(objs,obj_)	
                path=path=='/cmsadmin/'?'/cmsadmin/index':path;
				res.render(path.replace('/',''),obj_);
			})
		}
	});
}

//web
var sql_nav = 'SELECT * FROM nav';
function webrenders(path,objs){
    router.get(path, function(req, res, next) {
        sqlData(sql_nav, function(result) {
        	var nav_arr = [],nav_name_list={};
        	nav_arr.push({id: 99999, nav_name: "首页", nav_rank: 1, nav_parent: 0, nav_class: "home",pagename:'home',nav_show: 1,nav_on:''})
        	nav_arr[0].nav_on=nav_arr[0].pagename==objs.thispage?'layui-this':''
    		result.forEach(function(value,index,array){
    			value.nav_on=value.pagename==objs.thispage?'layui-this':''
    			if(value.nav_show==1){
    				if(value.nav_rank == 1){
	    				value.nav_list=[];
	    				nav_arr.push(value);
	    				nav_name_list[value.id]=nav_arr.length-1;
	    			}else{
	    				nav_arr[nav_name_list[value.nav_parent]].nav_list.push(value);
	    			}
    			}
    		})

			var obj_ = {layout: 'web/layout',nav: nav_arr};
	        mergeJSON(objs,obj_);
	        path=path=='/'?'/index':path;
	        res.render('web'+path,obj_);
		})
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