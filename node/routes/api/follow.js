let router = require('express').Router();
let mgdb = require('../../utils/mgdb.js');
router.get('/',(req,res,next)=>{
	let _id = req.query._id;
	if(!_id){
		mgdb.find({
			collectionName:'follow',
			...req.query
		}).then(
			result=>res.send(result)
		).catch(
			err=>res.send(err)
		)
	}else{
		mgdb.find({collectionName:'follow',_id:_id
		}).then(
			result=>res.send(result)
		).catch(
		err=>res.send(err)
		)
	}

})
router.get('/:_id',(req,res,next)=>{
	mgdb.find({collectionName:'follow',_id:req.params._id,
	}).then(
		result=>res.send(result)
	).catch(
      err=>res.send(err)
    )
})


module.exports=router;