const db = require("../../../database/db");
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../../../configuration/key");
var jwt_Decode = require("jwt-decode");
const { json } = require('body-parser');


module.exports ={


    assignPackege : (req, res)=>{


        var { userEmail,packegeName , noSession , Time , prize} = req.body;
        const token = req.headers["authorization"];
        // console.log(token);
        var decoded = jwt_Decode(token);
        // verify token pending
        adminEmail = decoded.sub.e;
        // console.log(email);
        
        
        let sqlAdminRange = "SELECT rangeName FROM users WHERE userEmail = ?";
        let query = db.query(sqlAdminRange, [adminEmail], (err, adminRangeresults) => {
          if (err) throw err;
          
            adminRange  = adminRangeresults[0].rangeName;

            let sqluserRange = "SELECT rangeName FROM users WHERE userEmail = ?";
            let query = db.query(sqluserRange, [userEmail], (err, userRangeresults) => {
              if (err) throw err;
              
                if(userRangeresults.length == 0){
                    res.json("user is not register")
                }else {

                    userRange = userRangeresults[0].rangeName;
                    

                    if(userRange == adminRange) {

                        //assign pacake

                        //time is null
                        if(Time == null){

                            
                            let sqlprofileSession = "SELECT no_sessions FROM profile WHERE profileEmail = ?";
                            let query = db.query(sqlprofileSession, [userEmail], (err, sessionresults) => {
                                if (err) throw err;
                                if(sessionresults.length == 0){
                                    res.json({
                                        message : "user is not approved"
                                    })
                                }else{

                                    no_session = sessionresults[0].no_session;
                                    no_session = no_session + noSession;

                                    let sqlupdateProfile = "UPDATE profile set no_sessions =? , packege = ? WHERE profileEmail = ? ";
                                    let query = db.query(sqlupdateProfile, [no_session ,packegeName, userEmail], (err, updateresults) => {
                                      if (err) throw err;
                                      console.log(updateresults);
                                      res.json({
                                        message: "session update sussesfully",
                                      });
                                    });



                                }


                            });


                        }
                        // session is null
                        if(noSession == null){

                            let sqlprofileTime = "SELECT fromTime , toTime FROM profile WHERE profileEmail = ?";
                            let query = db.query(sqlprofileTime, [userEmail], (err, timeupdateresults) => {
                              if (err) throw err;
                              console.log(timeupdateresults);

                              formTime = new Date(timeupdateresults[0].formTime).valueOf;
                              toTime = new Date(timeupdateresults[0].toTime).valueOf;

                              currentDate = new Date().valueOf;

                              if(toTime <currentDate){

                                formtime = new Date(toTime);

                                toTime = toTime.setMonth(toTime.getMonth() + Time );
                                  let sqlupdateTime = "UPDATE profile SET fromTime = ? , toTime = ? , packege = ? WHERE profileEmail = ?";
                                  let query = db.query(sqlupdateTime, [fromTime , toTime ,packegeName, userEmail], (err, updateresults) => {
                                      if (err) throw err;
                                     
                                      res.json({
                                          message : "session update sussessfull"
                                      })


                                  });





                              }
                              if(toTime>currentDate){

                                formTime = new Date();

                                toTime = toTime.setMonth(toTime.getMonth() + Time );

                                let sqlupdateTime = "UPDATE profile SET fromTime = ? , toTime = ? , packege = ?WHERE profileEmail = ?";
                                let query = db.query(sqlupdateTime, [fromTime , toTime ,packegeName,  userEmail], (err, updateresults) => {
                                    if (err) throw err;
                                   
                                    res.json({
                                        message : "session update sussessfull"
                                    })


                                });

                              }
                                            
                             




                            });







                        // both not null
                        }else {

                            let sqldata = "SELECT no_sessions , fromTime , toTime FROM profile WHERE profileEmail = ?";
                            let query = db.query(sqldata, [userEmail], (err, dataresults) => {
                                if (err) throw err;
                                console.log(dataresults);
                                
                                no_session = dataresults[0].no_sessions;
                                fromTime = dataresults[0].fromTime;
                                toTime = dataresults[0].toTime;

                                no_session = no_session + noSession;

                                // formTime = new Date(formTime).valueOf;
                                // toTime = new Date(toTime).valueOf;

                                currentDate = new Date()
                                console.log(toTime)
                                console.log(currentDate)
                                if (toTime < currentDate) {
                                    console.log("1")

                                    fromtime = new Date();

                                    toTime = new Date(toTime.setMonth(toTime.getMonth() + Time));
                                    let sqlupdateTime = "UPDATE profile SET fromTime = ? , toTime = ? , no_sessions = ? , package = ? WHERE profileEmail = ?";
                                    let query = db.query(sqlupdateTime, [fromTime, toTime,no_session, packegeName,userEmail], (err, updateresults) => {
                                        if (err) throw err;

                                        res.json({
                                            message: "session update sussessfull"
                                        })


                                    });





                                }
                                if (toTime > currentDate) {
                                    console.log("2")
                                    formTime = new Date();
                                    console.log(toTime)
                                    

                                    toTime = new Date(toTime.setMonth(toTime.getMonth() + Time));
                                    console.log(toTime)
                                    let sqlupdateTime = "UPDATE profile SET fromTime = ? , toTime = ?, no_sessions = ? , package = ? WHERE profileEmail = ?";
                                    let query = db.query(sqlupdateTime, [fromTime, toTime,no_session, packegeName,userEmail], (err, updateresults) => {
                                        if (err) throw err;

                                        res.json({
                                            message: "session update sussessfull"
                                        })


                                    });

                                }




                            });




                        }




                    }else {

                        res.json({
                            message : "you are not allow to to any task on different user"
                        })
                    }


                }

            });







        });        





    }



}