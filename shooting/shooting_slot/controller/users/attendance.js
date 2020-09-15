
const db = require('../../database/db')
const { TIMESTAMP } = require('mysql/lib/protocol/constants/types')
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configuration/key");
var jwt_Decode = require("jwt-decode");


module.exports = {


    showAttendance : async (req, res) => {

        const token = req.headers["authorization"];

        var decoded = jwt_Decode(token);
   
        
    // console.log(email);

        if (token) {
            // verify secret and checks exp
            jwt.verify(token, "shootingauthentication", function (err, currUser) {
                if (err) {
                    res.send(err);
                    console.log("not verified")
                } else {
                    // decoded object
                    req.currUser = currUser;
                    console.log("verified");

                    userEmail = decoded.sub.e;




                    let sqlprofile = "SELECT no_sessions, fromTime ,toTime ,isActive , isApproved FROM profile WHERE profileEmail = ? ";
                    let query = db.query(sqlprofile,[userEmail], (err, proresults) => {
                      if (err) throw err;
                      console.log(proresults);

                      if(proresults[0].isApproved == 0){
                          res.json({
                              message : "not approved by admin"
                          })
                      }else {
                      
                       no_sessions = proresults[0].no_sessions;
                       fromTime = proresults[0].fromTime;
                       toTime = proresults[0].toTime;
                        console.log(String(fromTime))


                        let sqlattendance = "SELECT  * FROM `attendances_shooters` WHERE `attendances_shooters`.`shooterEmail` = ?";
                        let query = db.query(sqlattendance, [userEmail], (err, altresults) => {
                            if (err) throw err;
                           
                           
                            
                            dataLen = altresults.length;
                            date =  [];

                            for(i =0 ;i<dataLen;i++){
                                console.log(altresults[i].Date)
                                databaseDate = new Date(altresults[i].Date).valueOf();
                                
                                oldDate = new Date(fromTime).valueOf()
                                console.log(oldDate)
                                if(databaseDate > oldDate){

                                   date.push(altresults[i].Date)



                                }

                            }
                            res.json(
                                            { no_of_session : no_sessions,
                                              date : date  
                                            }
                                        )


                        });

                       
                    }


                    });





                    

                    





                    
                }
            });
            console.log(token)
         }else {
             res.json(
                { message : "please provide token" }
            )
         }


    }


}