const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

// craete a schema
const userschemas = mongoose.Schema({

    firstName :{
        type :String,
            required: true
    },
    middleName : {
        type: String,
            required :false
    },
    lastName : {
        type: String,
            required: true

    },
    userName : {

        type : String,
        required : true
    },

    email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true
        },
    password : { 
        type: String, 
        required: true
    }
});

userschemas.pre('save', async function(next) {
    try {
        //generate salt
        const salt =  await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    }catch (err) {
        next : err
        }

})

userschemas.methods.isValidPassword = async function (newpassword) {
    try{
        //this compare normal password with hash passwords
       return await bcrypt.compare(newpassword , this.password)

    }catch (err) {
        throw new Error(err);
    }
}

//create model 
const User = mongoose.model('user ' , userschemas)

module.exports = User;