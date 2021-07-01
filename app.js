const Koa = require('koa')
const mongoose = require('mongoose')
const path = require('path')
const KoaRouter = require('koa-router')
const router = new KoaRouter()
const app = new Koa()
const db = require('./config/key').mongoURI
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')


//引入
const user = require('./routes/api/user')
const profile = require('./routes/api/profile')


app.use(bodyParser())
app.use(passport.initialize())
app.use(passport.session())

//回调到config passport.js
require("./config/passport")(passport)


mongoose.connect(db, { useNewUrlParser: true }).then(() => {
	console.log('数据库链接成功')
}).catch(e => {
	console.log(e,'错误')
})




router.get('/', async ctx => {
	ctx.body = {
		msg: 'hello'
	}
})

//配置路由地址
router.use("/api/user", user)
router.use("/api/profile", profile)



//路由
app.use(router.routes()).use(router.allowedMethods())

const port = process.env.PORT || 3000

app.listen(port, () => {
	console.log('启动')
})