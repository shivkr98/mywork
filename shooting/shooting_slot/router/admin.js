const express = require ('express');
const router = express.Router();
const db = require("../database/db");

const admineUserControl = require("../controller/admin/userControl/usercontrol")
const admineUserlistControl = require("../controller/admin/userControl/list_approve")
const adminslotControl = require('../controller/admin/userControl/slot_control')
const adminpackege = require('../controller/admin/userControl/packegeControl')

var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../configuration/key");
var jwt_Decode = require("jwt-decode");
const { json } = require('body-parser');


function check(req , res,next)  {


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

                // here we check master editer is a admin or not
                let sql =  "SELECT `userType` FROM `users` WHERE `userEmail` = ? " ;
                let query_profile = db.query(sql, [email], (err, results) => {
                if (err) throw err;
                    
                  if (results[0].userType == 0){
                    next();
                  }
                  else {
                    res.json({message : "you are not allow to change master"})
                  }
                }); 


            // next();
          }
        });
        console.log(token)
      }else{
          json({message : "you are not authorized"})
      }

}



router.route("/approve")
.post(check,admineUserControl.approveUser)

router.route("/refuse")
.post(check,admineUserControl.refuseUser)

router.route("/approvedlist")
.post(check,admineUserlistControl.list_approved )

router.route("/unapprovedlist")
.post(check,admineUserlistControl.list_nonaproved)

router.route("/deactivateLane")
.post(check , adminslotControl.unActivelane)

router.route("/activateLane")
.post(check , adminslotControl.Activelane)

router.route("/assignPackege")
.post(check , adminpackege.assignPackege)



module.exports = router;

