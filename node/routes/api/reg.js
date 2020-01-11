let router = require('express').Router();
let bcrypt = require('bcryptjs')
let fs = require('fs');
let pathc = require("path");
let open = require('../../utils/mgdb').open;

router.post('/',(req,res,next)=>{
	let {username,password,nikename}=req.body;
	if(!username||!password){
		res.send({
			err:1,
			msg:'用户名,密码为必传参数'
		});
		return;
	}
	nikename = nikename || '随即昵称';
	let follow = 0;
	let fans = 0;
	let time = Date.now();
	let icon;
		
	if(req.files && req.files.length>0){
		fs.renameSync(
			req.files[0].path,
			req.files[0].path + pathc.parse(req.files[0].originalname).ext
		)
		icon = '/upload/user/' + req.files[0].filename + pathc.parse(req.files[0].originalname).ext
	}else{
		icon = '/upload/default.jpg'
	}
	open({
		dbName:'newsapp',
		collectionName:'user'
	}).then(
		({collection,client})=>{
			collection.find({
				username
			}).toArray((err,result)=>{
				if(err){
					res.send({err:1,msg:'集合操作失败4'})
				}else{
					if(result.length == 0){
						var hash = bcrypt.hashSync(password, 10);
						//入库
						collection.insertOne({
							nikename, username, fans, follow, time, icon, password: hash
						},(err,result)=>{
							if(!err){
								delete result.ops[0].username;
								delete result.ops[0].password;
								res.send({
									err:0,msg:"注册成功",data:result.ops[0]
								})
							}else{
								res.send({
									err:1,msg:"注册失败",
								})
							}
						})
					}else{
						if(icon.indexOf('default')=== -1){
							fs.unlinkSync('./public'+icon);
						}
						res.send({err:1,msg:'用户名已存在'})
					}
				}
				client.close()
			})
		}
	)
})

module.exports=router;