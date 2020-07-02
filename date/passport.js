const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local')
const shivStrategy = require('passport-local')
const {JWT_SECRET} = require('./configuration/index')
const User =require('./model/users')
var jwt_Decode = require('jwt-decode');


passport.use( new jwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : JWT_SECRET
} , async(payload , done) => {
    
    try {
        // find the user token
        id = payload.sub.i
        const user  =await User.findById(id)
        
        if(!user) {
            return done(null , false)
        }
    

        // otherwise ,return the uesr
        done(null, user)
        

    }catch (err) {
        done(err,false)
    }    

}))


// local strategy
passport.use(new LocalStrategy({
    usernameField : 'email'
} , async(email, password ,done) => {

    
    try {

         // find the user given the emial
        user = await User.findOne({email})
        // if not ,handle
        if(!user) {
            return done(null ,false)
        }
        // check if the password is correct
        const isMatch = await user.isValidPassword(password);

        // if not handel it
        if(!isMatch) {
            return done(null , false)
        }

        // otherwise ,return user
        done(null , user)



    }catch (err) {
        done(err, false);
            }


   
}))
