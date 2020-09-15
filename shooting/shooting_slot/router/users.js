const express = require('express')
const router = express.Router()
const db = require("../database/db");


const UserController = require('../controller/users/users')
const profileController = require('../controller/users/profile/profile')
const slotBooking = require('../controller/users/slotBooking')
const attendanceUser = require('../controller/users/attendance')
const messageController = require('../controller/users/message')

const performanceContoller = require('../controller/users/performance')

var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../configuration/key");
var jwt_Decode = require("jwt-decode");
const { json } = require('body-parser');



function check(req ,res,next){


    const token = req.headers["authorization"];

    if (token) {
  // verify secret and checks exp
    jwt.verify(token, "shootingauthentication", function (err, currUser) {
        if (err) {
        res.send(err);
        console.log("not verified")
        } else {
        // decoded object
        req.currUser = currUser;
        console.log("verified")
            var decoded = jwt_Decode(token);
            email = decoded.sub.e;
            console.log(email)
            let sql = "SELECT `userType` , `isApproved` FROM `users` WHERE isActive = 1 AND `userEmail` = ? ";
            let query_profile = db.query(sql, [email], (err, results) => {
                if (err) throw err;
                if(results.length == 0){
                    res.json({
                        message : "your token is not valid please singup again"
                    })
                   
                }else{
                    console.log(results)

                
                if (results[0].userType == 1   && results[0].isApproved == 1) {
                    next();
                }
                else {
                    res.json({ message: "you are not shooter or not approved by admin" })
                }
            
            }
            });


      
           
        }
        });
    console.log(token)  
    }else {
        res.json({
            message : "you are not authorized"
        })
    }   



}





router.route('/register')
    .post(UserController.register)

router.route('/login')
    .post(UserController.login)    

router.route('/token')
    .get(UserController.token);     

router.route('/showprofile')
    .get(check,profileController.showProfile);       

router.route('/addprofile')
    .post(check,profileController.upd_ins_Profile);    
    
router.route('/bookslot')
    .post(check,slotBooking.bookSlot);
  
router.route('/showslot')
    .post(check,slotBooking.showSlot);    

router.route('/showmybooking')
    .post(check,slotBooking.showMybooking);  
  
     
router.route('/deletebooking')
    .post(check,slotBooking.removeBooking); 


router.route('/showAttendance')
    .get(check,attendanceUser.showAttendance);


router.route('/sendMessage')
    .post(check,messageController.sendMessage);

router.route('/showMessage')
    .post(check,messageController.showMessage)

router.route('/showperformance')
    .post(check,performanceContoller.showPerformance)


router.route('/showrounds')
    .post(check,performanceContoller.showRound )




module.exports = router;    
