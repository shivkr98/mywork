require("dotenv").config();
const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const passport = require('passport')
require('./passport-setup');
const cors = require('cors')
const JWT = require('jsonwebtoken')
const {JWT_SECRET} = require('./configuration/key') 
//create conncetion





const db = require('./database/db')
const cookieSession = require('cookie-session')
const{PORT} = process.env;
app.use(cors())

app.use(express.static('./uploads/'));

//connect 
db.connect((err) => {
    if(err) {
        throw err;
    
    }
    console.log("database is connected ")

} )

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())




//create table
app.use("/users", require('./router/users'))
app.use("/master" , require('./router/master'))
app.use("/admin" , require('./router/admin'))
app.use("/coach" , require('./router/coach'))




app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Auth middleware that checks if the user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

  

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());






app.listen(PORT , () => {
    console.log(`server is runing at 3000`)
})

