const JWT = require('jsonwebtoken')

const User  = require('../model/users')


const {JWT_SECRET} = require('../configuration/index') 

const passport = require('passport')
const passportconf = require('../passport')


var jwt_Decode = require('jwt-decode');





signToken = user =>{

    return JWT.sign({
        iss : 'Date',
        sub: {
            i:user.id,
            e: user.email,
           
        },
        iat : new Date().getTime(), // current date
        exp : new Date().setTime(new Date().getTime() * 1) // current time +1 day ahead

    } , JWT_SECRET);


} 

    

module.exports = {

    signup : async(req , res, next) => {
        // validation email and password
        
        
        const {firstName , middleName ,lastName,userName,email , password } = req.body
        
        const finduser = await User.findOne({email})
        if (finduser) {
            return res.json({error : 'Email already in use'})
        }
       
        

        

        // check if there is a user with same email


        // create new user
        const newUser = new User({firstName , middleName ,lastName,userName,email , password })
    
        await newUser.save();
        
        //generate the token
        res.json({message : "successfully created"})


    },

    
    signin : async(req , res, next) => {
        //genrate  token
        
        const token = signToken(req.user)
        var decoded = jwt_Decode(token);
        email = decoded.sub.e;

        // const data1 = User.find({ email:email })
        // console.log(data1)

        const data = await User.findOne({ email: email });
        const firstName = data.firstName
        const middleName = data.middleName
        const lastName = data.lastName
        
        
        res.status(200).json({
          message: "login success",
          email: email,
          name: firstName + middleName + lastName,
          jwtToken: token,
        });
        


        
    }

   

}

