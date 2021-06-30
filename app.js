const exrpess = require('express')
const mongoose = require("mongoose")
const bodyParser=require('body-parser')
const passport=require('passport')
const app=exrpess()

const users=require('./router/api/users')
const profiles=require('./router/api/profiles')
const manager=require('./router/api/managers')

const db=require('./config/key').mongoURL
//const Manager = require('./model/Managers')

// 使用中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



mongoose.connect(db,{
    useNewUrlParser:true,
    useFindAndModify: true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('成功');
}).catch(()=>{
    console.log('失败');
})

// 初始化
app.use(passport.initialize());
//配置passport
require('./config/passport')(passport)

app.use('/api/manager',manager)
app.use('/api/users',users)
app.use('/api/profiles',profiles)


const port=process.env.PORT || 5000

app.listen(port,()=>{
    console.log("http://localhost:5000/");
})