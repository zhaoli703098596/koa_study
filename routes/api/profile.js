const KoaRouter = require('koa-router')
const router = new KoaRouter()
const passport = require('passport')
//引入Profile
const Profile = require('../../models/Profile')
//引入User
const User = require('../../models/User')
//引入Keys
const Keys = require('../../config/key')

/**
 * @route GET api/profile/test
 * @desc 测试接口地址
 * @access 接口公开
 */

router.get("/test", async ctx => {
	ctx.status = 200;
	ctx.body = {
		msg: '成功'
	}
})



/**
 * @route GET api/profile
 * @desc 个人信息接口地址
 * @access 接口私有
 */

router.get("/", passport.authenticate('jwt', { session: false }), async ctx => {
	console.log(ctx.state.user)
	const profile = await Profile.find({ user: ctx.state.user.id }).populate("user", ['name', 'avatar'])
	console.log(profile)
	// ctx.status = 200;
	// ctx.body = {
	// 	msg: '成功'
	// }
	if (profile) {
		ctx.status = 200;
		ctx.body = {
			info: profile
		}
	} else {
		ctx.status = 400;
		ctx.body = {
			msg: 'no'
		}
	}
})



/**
 * @route GET api/profile/delete
 * @desc 删除
 * @access 接口私有
 */

 router.get("/delete", passport.authenticate('jwt', { session: false }), async ctx => {
	const profile=await Profile.deleteOne({user:ctx.state.user.id})
	if(profile.ok==1){
		const user=await User.deleteOne({_id:ctx.state.user.id})
		if(user.ok==1){
			ctx.status=200
			ctx.body={
				msg:'删除成功'
			}
		}else{
			ctx.status=400
			ctx.body={
				msg:'删除失败'
			}
		}
	}




})



/**
 * @route POST api/profile
 * @desc  添加编辑信息接口地址
 * @access 接口私有
 */

router.post("/", passport.authenticate('jwt', { session: false }), async ctx => {
	const profileFields = {}
	profileFields.user = ctx.state.user.id

	if (ctx.request.body.handle) {
		profileFields.handle = ctx.request.body.handle
	}
	if (ctx.request.body.status) {
		profileFields.status = ctx.request.body.status
	}
	if (ctx.request.body.company) {
		profileFields.company = ctx.request.body.company
	}
	if (ctx.request.body.website) {
		profileFields.website = ctx.request.body.website
	}
	if (ctx.request.body.location) {
		profileFields.location = ctx.request.body.location
	}
	if (typeof ctx.request.body.skills!=='undefined') {
		
		profileFields.skills = ctx.request.body.skills.split(',')
	}
	if (ctx.request.body.bio) {
		profileFields.bio = ctx.request.body.bio
	}
	if (ctx.request.body.githubusername) {
		profileFields.githubusername = ctx.request.body.githubusername
	}

	profileFields.social = {}
	if (ctx.request.body.wechat) {
		profileFields.social.wechat = ctx.request.body.wechat
	}
	if (ctx.request.body.QQ) {
		profileFields.social.QQ = ctx.request.body.QQ
	}
	if (ctx.request.body.tengxunkt) {
		profileFields.social.tengxunkt = ctx.request.body.tengxunkt
	}
	if (ctx.request.body.wangyikt) {
		profileFields.social.wangyikt = ctx.request.body.wangyikt
	}


	//查询
  const profile=await Profile.find({user:ctx.state.user.id})
	if(profile.length>0){
		 //修改
		 const profileUpdate=await Profile.findOneAndUpdate(
			 {user:ctx.state.user.id},
			 {$set:profileFields},
			 {new:true}
		 )
		 ctx.status = 400;
		 ctx.body = profileUpdate
	}else{
		//新增
		await new Profile(profileFields).save().then(profile=>{
			ctx.status = 200;
			ctx.body = profile
		})
	}

})


/**
 * @route GET api/profile/handle
 * @desc handle获取信息地址
 * @access 接口公开
 */

 router.get("/handle", async ctx => {
	const handle=ctx.query.handle
	const profile=await Profile.find({handle:handle}).populate("user", ['name', 'avatar'])
	console.log(profile)
	if(profile.length<1){
		ctx.status = 400;
		ctx.body = {
			msg:'未找到'
		}
	}else{
		ctx.status = 200;
		ctx.body = profile
	}
})


/**
 * @route GET api/profile/user
 * @desc user获取信息地址
 * @access 接口公开
 */

 router.get("/user", async ctx => {
	const user_id=ctx.query.user_id
	const profile=await Profile.find({user:user_id}).populate("user", ['name', 'avatar'])
	console.log(profile)
	if(profile.length<1){
		ctx.status = 400;
		ctx.body = {
			msg:'未找到'
		}
	}else{
		ctx.status = 200;
		ctx.body = profile
	}
})

/**
 * @route GET api/profile/all
 * @desc 获取所有信息地址
 * @access 接口公开
 */

 router.get("/all", async ctx => {
	const profile=await Profile.find({}).populate("user", ['name', 'avatar'])
	console.log(profile)
	if(profile.length<1){
		ctx.status = 400;
		ctx.body = {
			msg:'未找到'
		}
	}else{
		ctx.status = 200;
		ctx.body = profile
	}
})

module.exports = router.routes()