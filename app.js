const Koa=require('koa')
const KoaRouter=require('koa-router')
const json=require('koa-json')
const router=new KoaRouter()
const app=new Koa()

app.use(json())

// app.use(async ctx=>{ctx.body={msg:'hello'}})
router.get('/', async ctx=>{ctx.body={msg:'hello'}})



router.get('/test', async ctx=>{ctx.body={msg:'test'}})



//路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000,()=>{
    console.log('启动')
})