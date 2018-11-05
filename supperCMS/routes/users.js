var express = require('express');
var router = express.Router();
var $mysql = require("mysql");
var fs = require('fs');
var cookie = require('cookie-parser');

var bodyParser = require('body-parser');
var multer = require('multer');

var sql = require("../public/javascripts/mysql");
var $sql = $mysql.createConnection(sql.mysql)
$sql.connect()

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		// 接收到文件后输出的保存路径（若不存在则需要创建）
		cb(null, './public/uploadfile/images/');
	},
	filename: function(req, file, cb) {
		// 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
		cb(null, Date.now() + "-" + file.originalname);
	}
});
// 创建文件夹
var createFolder = function(folder) {
	try {
		// 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
		// 如果文件路径不存在将会抛出错误"no such file or directory"
		fs.accessSync(folder);
	} catch(e) {
		// 文件夹不存在，以同步的方式创建文件目录。
		fs.mkdirSync(folder);
	}
};

var uploadFolder = './public/uploadfile/images/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({
	storage: storage
});

// 创建 application/x-www-form-urlencoded 编码解析 --post
router.use(bodyParser.urlencoded({
	extended: false
}));

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});
//SQL语句
var sqln = 'SELECT name FROM user_table where name=';
var sqlp = 'SELECT password FROM user_table where password=';
router.post('/loginInquire', function(req, res, next) {
	//解析请求参数
	var params = req.body;
	$sql.query(sqln + '"' + params.name + '"', function(err, result) {
		if(err) {
			console.log('[SELECT ERROR] - ', err.message);
			res.send({
				data: null,
				state: 500,
				marked: '服务器异常'
			});
			return;
		}
		if(result.length > 0) {
			$sql.query(sqlp + '"' + params.password + '"', function(err, result) {
				if(err) {
					console.log('[SELECT ERROR] - ', err.message);
					res.send({
						data: null,
						state: 500,
						marked: '服务器异常'
					});
					return;
				}
				console.log(params.id);
				if(result.length > 0) {
					res.cookie('username', params.name);
					res.send({
						data: result,
						state: 200,
						marked: '登录成功'
					});
				} else {
					res.send({
						data: null,
						state: 400,
						marked: '密码错误'
					});
				}
			});
		} else {
			res.send({
				data: null,
				state: 400,
				marked: '账号不存在'
			});
		}
	});
});

//SQL语句
var sql_cnname = 'SELECT * FROM user_msg where cnname=';
router.post('/usermsg', function(req, res, next) {
	//解析请求参数
	var params = req.body;
	$sql.query(sql_cnname + '"' + params.name + '"', function(err, result) {
		if(err) {
			console.log('[SELECT ERROR] - ', err.message);
			res.send({
				data: null,
				state: 500,
				marked: '服务器异常'
			});
			return;
		}
		if(result.length > 0) {
			res.send({
				data: result,
				state: 200,
				marked: '查询成功'
			});
		} else {
			res.send({
				data: null,
				state: 400,
				marked: '没有这个用户的信息'
			});
		}
	});
});
var userModSql = 'UPDATE user_msg SET username = ?,cnname = ?,sex = ?,age = ?,birth = ?,portrait = ?,remark = ? WHERE id = ?';
//改 up
router.post('/usermsgedit', function(req, res, next) {
	//解析请求参数
	var params = req.body;
	var userModSql_Params = [params.username, params.name, params.sex, params.age, params.birth, params.portrait, params.remark, params.id];
	$sql.query(userModSql, userModSql_Params, function(err, result) {
		if(err) {
			console.log('[UPDATE ERROR] - ', err.message);
			res.send({
				data: result,
				state: 500,
				marked: '更新失败'
			});
			return;
		}
		console.log('----------UPDATE-------------');
		console.log('UPDATE affectedRows', result.affectedRows);
		console.log('******************************');
		res.send({
			data: result,
			state: 200,
			marked: '更新成功'
		});
	});
});

//上传文件
router.post('/file_upload', upload.single('file'), function(req, res) {
	//文件读取
	res.send({
		data: req.file.filename,
		state: 200,
		marked: '上传成功'
	});
})
module.exports = router;