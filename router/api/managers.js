const express = require('express')
const router= express.Router()
const bcrypt = require('bcrypt')
const gravatar = require('gravatar');
const jwt =require('jsonwebtoken')
const keys=require('../../config/key')
const User=require('../../model/User')
const Manager=require('../../model/Managers')
const passport =require('passport')
// 测试
router.get('/test',(req,res)=>{
    res.json({
        msg:'123'
    })
})

// 注册
router.post('/register',(req,res)=>{
    // console.log(req.body);
    Manager.findOne({email:req.body.email}).then((manager)=>{
        if(manager){
            return res.status(400).json({email:'邮箱被注册'})
        }else{
            // const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
            const avatar="https://gravatar.loli.net/avatar/363382c08ef05d185ffefc8b8d16d4c1?s=200&r=pg&d=mm"
            const newManager=new Manager({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                avatar,
                identity:req.body.identity
            })
            //密码加密
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newManager.password, salt, (err, hash)=> {
                    if(err) throw err;
                    newManager.password = hash;
                    newManager.save()
                                .then(manager=>res.json(manager))
                                .catch(err=>console.log(err))
                });
            });           
        }
    })
})
// 登录
router.post('/login',(req,res)=>{
    const {email,password}=req.body
    // 查询数据
    Manager.findOne({email})
        .then(manager=>{
            if(!manager){
                return res.status(404).json({email:"用户不存在"})
            }
            bcrypt.compare(password, manager.password)
                .then(isMatch=>{
                    if(isMatch){
                        const rule={
                            id:manager._id,
                            name:manager.name,
                            avatar:manager.avatar,
                            identity:manager.identity
                        };//规则
                        // 规则和加密名字、过期时间，函数
                        jwt.sign(rule,keys.secrentkey,{expiresIn:3600},(err,token)=>{
                            if(err) throw err
                            res.json({
                                'success':true,
                                'token':"Bearer "+token
                            })
                        })
                        // res.json({msg:'success'})
                    }else{
                        return res.status(400).json({"password":'密码错误'})
                    }
                })
        })
})

router.get('/cuuent',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.manager.id,
        name:req.manager.name,
        email:req.manager.email,
        identity:req.manager.identity
    })
})
module.exports=router