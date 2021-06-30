const KoaRouter = require('koa-router')
const router = new KoaRouter()
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar')
const tools = require("../../config/tools")
const jwt = require('jsonwebtoken')

const passport=require('passport')


//引入User
const User = require('../../models/User')
//引入Keys
const Keys = require('../../config/key')
//引入验证
const validateRegisterInput=require('../../validation/register')
const validateLoginInput=require('../../validation/login')



/**
 * @route POST api/user/register
 * @desc 注册接口地址
 * @access 接口公开
 */

router.post("/register", async ctx => {
	console.log(ctx.request.body)

	const {errors,isValid}=validateRegisterInput(ctx.request.body)

	//判断是否通过
	if(!isValid){
		ctx.status = 400;
		ctx.body = errors
		return
	}


	const findResult = await User.find({ email: ctx.request.body.email })
	if (findResult.length > 0) {
		ctx.status = 500;
		ctx.body = {
			msg: '邮箱已被占用'
		}
	} else {
		const avatar = gravatar.url(ctx.request.body.email, { s: '200', r: 'pg', d: 'mm' })
		const newUser = new User({
			name: ctx.request.body.name,
			email: ctx.request.body.email,
			password: tools.enbcrypt(ctx.request.body.password),
			avatar
		})
		//存储
		await newUser.save().then(user => {
			ctx.status = 200;
			ctx.body = user
		}).catch(e => {
			console.log(e)
		})
		// ctx.status = 200;
		// ctx.body =newUser
	}

})


/**
 * @route POST api/user/login
 * @desc 登录接口地址 返回token
 * @access 接口公开
 */

router.post("/login", async ctx => {
	console.log(ctx.request.body)
	const {errors,isValid}=validateLoginInput(ctx.request.body)

		//判断是否通过
		if(!isValid){
			ctx.status = 400;
			ctx.body = errors
			return
		}
	const findResult = await User.find({ email: ctx.request.body.email })
	const password = ctx.request.body.password
	if (findResult.length == 0) {
		ctx.status = 400;
		ctx.body = {
			msg: '用户不存在'
		}
	} else {
		const user = findResult[0]

		let result = bcrypt.compareSync(password, user.password);
		if (result) {
			const payload = {
				id: user._id,
				name: user.name,
				avatar: user.avatar
			}

			const token = jwt.sign(payload, Keys.secretOrKey, { expiresIn: 3600 })

			ctx.status = 200;
			ctx.body = {
				success: true,
				token: "Bearer " + token
			}
		} else {
			ctx.status = 400;
			ctx.body = {
				msg: '密码错误'
			}
		}
	}

})


/**
 * @route GET api/user/current
 * @desc 用户信息 返回用户
 * @access 接口私密
 */

router.get("/current", passport.authenticate('jwt', { session: false }), async ctx => {
	ctx.body = {
		id:ctx.state.user.id,
		name:ctx.state.user.name,
		email:ctx.state.user.email,
		avatar:ctx.state.user.avatar,

	}


})


module.exports = router.routes()