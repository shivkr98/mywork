

const express = require ('express');
const router = express.Router();
const db = require("../database/db");



var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../configuration/key");
var jwt_Decode = require("jwt-decode");
const { json } = require('body-parser');

const coachControl = require("../controller/coach/laneControl");
const attendanceControl = require('../controller/coach/attendance')
const messageControl = require('../controller/coach/messages')
const performanceController = require("../controller/coach/performance")

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
                let sql =  "SELECT `userType`, `isActive`,`isApproved` FROM `users` WHERE isActive = 1 AND `userEmail` = ? " ;
                let query_profile = db.query(sql, [email], (err, results) => {
                if (err) throw err;

                  if(results.length == 0){
                    res.json({
                      message : "no user register"
                    })

                  }else{

                    
                  if (results[0].userType == 2 && results[0].isApproved == 1){
                    next();
                  }
                  else {
                    res.json({message : "you are not coach"})
                  }
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

router.route("/unbooklane")
    .post(check ,coachControl.unbookLane );

router.route("/booklane")
    .post(check ,coachControl.bookslot );

  
router.route('/showSlot')
  .post(check,coachControl.showSlot)
router.route('/addAttendance')
    .post(check, attendanceControl.addAttendance);

router.route('/showAttendance')
    .get(check, attendanceControl.showAttendance);


router.route('/sendMessage')
  .post(check,messageControl.sendMessage);
  
router.route('/showMessage')
.get(check,messageControl.showMessage);

router.route('/addRound')
.post(check,performanceController.addRecord)


module.exports = router;    