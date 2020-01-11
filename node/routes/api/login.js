let router = require('express').Router();
let open = require('../../utils/mgdb').open;
let jwt = require('../../utils/jwt')
let bcrypt = require('bcryptjs')
router.post('/',(req,res,next)=>{
	let {username,password}=req.body;
	if(!username||!password){
		res.send({
			err:1,
			msg:'用户名,密码为必传参数'
		});
		return;
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
					res.send({err:1,msg:'集合操作失败3'})
				}else{
					if(result.length>0){
						let bl = bcrypt.compareSync(password, result[0].password);
						if(bl){		
							let token = jwt.sign({username,id:result[0]._id});
							
							delete result[0].username;
							delete result[0].password;
							
							res.send({err:0,msg:'登陆成功',data:result[0],token})
						}else{
							res.send({err:1,msg:'用户名密码错误'})
						}
					}else{
						res.send({err:1,msg:'登陆失败'})
					}
				}
				client.close()
			})
		}
	).catch()
})

module.exports=router;