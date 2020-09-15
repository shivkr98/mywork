
const db = require('../../database/db')
const { TIMESTAMP } = require('mysql/lib/protocol/constants/types')
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configuration/key");
var jwt_Decode = require("jwt-decode");


module.exports={
    
    showAttendance : async(req, res) => {       
        const token = req.headers["authorization"];
        var{
            shooterEmail,
             Date,
           
        } = req.body
        
       
        if (token) {
            // verify secret and checks exp
            jwt.verify(token, "shootingauthentication", function (err, currUser) {
                if (err) {
                res.send(err);
                console.log("not verified")
                } 
                else {
                    // decoded object
                    req.currUser = currUser;
                    console.log("verified")
                    var decoded = jwt_Decode(token);
                    userEmail = decoded.sub.e;
                    console.log(userEmail)
                  
                            // here we impliment the code  
                           
                    
                    coachEmail = userEmail;

                    let sqlcoach = "SELECT rangeName FROM users WHERE userEmail = ?";
                    let querycoach = db.query(sqlcoach, [coachEmail], (err, coachresults) => {
                      if (err) throw err;
                     
                      coachrangeName = coachresults[0].rangeName;

                        let sqlshooter = "SELECT `rangeName`, `isActive` , 'isApproved' FROM `users` WHERE `users`.`userEmail` = ?";
                        let queryshooter = db.query(sqlshooter, [shooterEmail], (err, shooterresults) => {
                        if (err) throw err;
                        console.log(shooterresults);

                        

                        if(shooterresults.length != 0){


                            if(shooterresults[0].isActive == 0){
                                res.json({
                                    message : "shooter is not register"
                                })

                            }else{
                            if(shooterresults[0].isApproved ==0){

                                res.json({
                                    message : "shooter is not approved by admin"
                                })

                            }else{

                            shooterrangeName = shooterresults[0].rangeName;



                            if(coachrangeName == shooterrangeName){

                            let sqlRegister = "SELECT  * FROM `attendances_shooters` WHERE `attendances_shooters`.`shooterEmail` = ? AND `attendances_shooters`.`Date` = ? ";
                            let query = db.query(sqlRegister, [shooterEmail,Date], (err, results) => {
                            if (err) throw err;
                            console.log(results);
                            
                            if(results.length >0){
                                    res.json({
                                        message: "Success",
                                        results: results
             
              
                                        });
                                    }else{
                                        res.json({
                                            message : "shooter is not present at this date"
                                        })
                                    }
                            
                             }); 

                            }else {

                                res.json(
                                                    { message : "you are not authorized to check the attendance" }
                                                )
                            }



                            }
                            }

                        }else{

                            res.json({
                                message : "shooter not valid"
                            })


                        }
                    });



                    });
                  
                    
                    
                }  
            })  
        }
        else {
            res.json({
                message : "you are not authorized"
                })
        }
    },

    addAttendance: async (req, res) => {
        const token = req.headers["authorization"];
        var {
            shooterEmail,
            laneNumber,
            Date,
            Time

        } = req.body

        if (token) {
            // verify secret and checks exp
            jwt.verify(token, "shootingauthentication", function (err, currUser) {
                if (err) {
                    res.send(err);
                    console.log("not verified")
                }
                else {
                    // decoded object
                    req.currUser = currUser;
                    console.log("verified")
                    var decoded = jwt_Decode(token);
                    userEmail = decoded.sub.e;
                    console.log(userEmail)

                    coachEmail = userEmail
                    
                    let coachRange = "SELECT `rangeName` FROM `users`  WHERE `userEmail` = ?  ";
                    db.query(coachRange, [coachEmail], (err, rangeCresults) => {
                        if (err) throw err;

                        if (rangeCresults.length > 0) {

                            coachRange = rangeCresults[0].rangeName

                            let shooterRange = "SELECT `rangeName` FROM `users` WHERE `userEmail` = ? ";
                            db.query(shooterRange, [shooterEmail], (err, rangeSresults) => {
                                if (err) throw err;

                                if (rangeSresults.length > 0) {

                                    shooterRange = rangeSresults[0].rangeName

                                    if(rangeSresults[0].isActive == 0 ){

                                        res.json({
                                            message : "shooter is not register "
                                        })
                                    }else{

                                    if (coachRange == shooterRange) {

                                        let sqLCHECK = "SELECT * FROM `attendances_shooters` WHERE `shooterEmail` = ? AND `rangeName` = ? AND `laneNumber` = ? AND `Date` = ? AND `Time` = ?";
                                        db.query(sqLCHECK, [shooterEmail, shooterRange, laneNumber, Date, Time], (err, checkresults) => {
                                            if (err) throw err;
                                            console.log(checkresults);


                                            if (checkresults.length > 0) {

                                                res.json({
                                                    message: "attendanace marked already"
                                                })

                                            } else {

                                                rangeName = shooterRange;
                                                var data = {
                                                    shooterEmail,
                                                    laneNumber,
                                                    rangeName,
                                                    Date,
                                                    Time
                                                }
                                                let sqlRegister = "INSERT INTO attendances_shooters SET ?";
                                                db.query(sqlRegister, data, (err, markresults) => {
                                                    if (err) throw err
                                                    console.log(markresults);

                                                    let sqlprofile = "SELECT no_sessions FROM profile WHERE profileEmail = ?";
                                                    db.query(sqlprofile, [shooterEmail], (err, proresults) => {
                                                        if (err) throw err
                                                        console.log(proresults[0]);
                                                        console.log(proresults[0].no_sessions)
                                                       
                                                        no_session = proresults[0].no_sessions;
                                                        session = no_session - 1;
                                                        console.log(session)
    
                                                        let sqlupdateprofiel = "UPDATE profile set no_sessions = ? WHERE profileEmail = ?";
                                                        db.query(sqlupdateprofiel , [session,shooterEmail], (err , newproresults) => {
    
                                                            if(err) throw err;
    
                                                            res.json({
                                                                message: "Attendance Marked",
                                                            })
    
    
                                                            
    
                                                        })
    
                                                    
                                                    })
                                                    
                                                })


                                                // minuse the number of session
                                               



                                            }
                                        })



                                    } else {
                                        res.json({
                                            message: "you are not authorized to mark attendance"
                                        })
                                    }
                                }




                                }
                                else {
                                    res.json({ message: "no profile exist" })
                                }
                            })
                            // next();
                        }
                        console.log(token)
                    })

                }
            })
        }
        else {
            res.json({
                message: "you are not authorized"
            })
        }
    }



    
}