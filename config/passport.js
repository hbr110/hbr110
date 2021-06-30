const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose=require('mongoose')
const User=mongoose.model('Users')
const Manager=mongoose.model('Managers')
const keys=require('../config/key')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secrentkey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
        User.findById(jwt_payload.id)
            .then(user=>{
                if(user){
                    return done(null,user)
                }
                return done(null,false)
            })
            .catch(err=>console.log(err))
        // console.log(jwt_payload);
    }));
}