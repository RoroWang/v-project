let router = require('express').Router();
let open = require('../../utils/mgdb').open;
let jwt = require('../../utils/jwt')

router.get('/',(req,res,next)=>{
	let token = req.headers.token || req.body.token || req.query.token;
	
	jwt.verify(token).then(
		decode => {
		open({
			dbName:'newsapp',
			collectionName:'user'
		}).then(
			({collection,client,ObjectId})=>{
				collection.find({
					username: decode.username, _id: ObjectId(decode.id)
				}).toArray((err,result)=>{
					if(err){
						res.send({err:1,msg:'集合操作失败3'})
					}else{
						if(result.length>0){
							delete result[0].username;
							delete result[0].password;
							res.send({err:0,msg:'登陆成功',data:result[0]})
						}else{
							res.send({err:1,msg:'登陆失败'})
						}
					}
					client.close()
				})
			}
		).catch()
		}
	).catch(
		message => res.send({
			err:1,
			data:'未登录'
		})
	)
})

module.exports=router;