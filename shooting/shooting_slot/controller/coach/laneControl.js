const db = require("../../database/db");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configuration/key");
var jwt_Decode = require("jwt-decode");


module.exports={


    unbookLane : (req ,res) =>{
        var {laneNo , Date , startTime} = req.body;
        isActive = 0

        const token = req.headers["authorization"];

        var decoded = jwt_Decode(token);
        email = decoded.sub.e;
        console.log(email)

        let sqlrange = "SELECT rangeName FROM users WHERE userEmail = ?";
        let queryrange = db.query(sqlrange, [email], (err, rangeresults) => {
          if (err) throw err;
          console.log(rangeresults[0]);

          rangeName = rangeresults[0].rangeName;


          let sqlslot = "SELECT * FROM slotbooking WHERE isActive = 1 AND laneNo = ? AND bookDate =? AND startTime = ? AND rangeName = ?";
          let queryslot = db.query(sqlslot, [laneNo , Date , startTime, rangeName], (err, slotresults) => {
            if (err) throw err;

            if(slotresults.length>0){
                console.log(slotresults);

                id = slotresults[0].Id;
               

                let sqlupdate = "UPDATE slotbooking SET isActive = 0 WHERE isActive = 1 AND Id = ?";
                let query = db.query(sqlupdate, [id], (err, updateresults) => {
                if (err) throw err;
                console.log(updateresults);
                res.json({message : "success"})
                
                });

                
            }else{
                res.json({message : "no slot is active "})
            }
          });

          
        });


        

    },

    showSlot : (req ,res) =>{

      var { Date , startTime} = req.body;

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
      
            
            let sqlrange = "SELECT rangeName FROM users WHERE userEmail = ?";
            let queryrange = db.query(sqlrange, [email], (err, rangeresults) => {
              if (err) throw err;
              console.log(rangeresults);
              rangeName = rangeresults[0].rangeName;

              let sqlRegister = "SELECT noLanes,digitalLane,electronic_beginnerLane,Electronic_advancedLane,Dry_praticeLane  FROM range_master WHERE rangeName = ?";
              let query = db.query(sqlRegister, [rangeName], (err, laneresults) => {
              if (err) throw err;
              console.log(laneresults);
              no_lanes = laneresults[0].noLanes;
              digitalLane = laneresults[0].digitalLane.split(',').map(function(el){ return +el;});
              electronic_beginnerLane = laneresults[0].electronic_beginnerLane.split(',').map(function(el){ return +el;});
              Electronic_advancedLane = laneresults[0].Electronic_advancedLane.split(',').map(function(el){ return +el;});
              Dry_praticeLane = laneresults[0].Dry_praticeLane.split(',').map(function(el){ return +el;});

              console.log(no_lanes)

              let sqlactivelane = "SELECT laneNo FROM  slotbooking WHERE isActive = 1 AND bookDate = ? AND startTime = ? AND rangeName = ?";
              let queryactivelane = db.query(sqlactivelane, [Date,startTime,rangeName], (err, activelaneresults) => {
              if (err) throw err;
              console.log(activelaneresults);
              lengthlane = activelaneresults.length
              console.log(lengthlane)
                
              var  activeLane = []
              for (i= 0 ; i<lengthlane ; i++){
               
                activeLane.push(activelaneresults[i].laneNo)

              }
              console.log(activeLane)

              var totalLane = []
              for (i = 1 ; i<=no_lanes;i++){

               
                 totalLane.push(i)
                
                
                

              }
              
              console.log(totalLane)
              const unactivedigitalLane = digitalLane.filter(function(x) { 
                return activeLane.indexOf(x) < 0;
              });
              const unactiveelectronic_beginnerLane  = electronic_beginnerLane .filter(function(x) { 
                return activeLane.indexOf(x) < 0;
              });

              const unactiveElectronic_advancedLane = Electronic_advancedLane.filter(function(x) { 
                return activeLane.indexOf(x) < 0;
              });

              const unactiveDry_praticeLane  = Dry_praticeLane.filter(function(x) { 
                return activeLane.indexOf(x) < 0;
              });




              console.log(digitalLane)


              res.json({
                digitalLane :unactivedigitalLane,
                electronic_beginnerLane : unactiveelectronic_beginnerLane,
                Electronic_advancedLane : unactiveElectronic_advancedLane,
                Dry_praticeLane : unactiveDry_praticeLane
                
              })


              });



             
              });
              
            });




        }
        });
    console.log(token)  
    }else {
        res.json({
            message : "you are not authorized"
        })
    }   


    },

    bookslot: (req ,res) =>{

      var {
        userEmail,laneNo , bookDate , startTime
        } = req.body
        date = bookDate;
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
                let sql =  "SELECT `userType` , `rangeName` FROM `users` WHERE `userEmail` = ? " ;
                let query_profile = db.query(sql, [email], (err, rangeresults) => {
                if (err) throw err;
                  
                  if (rangeresults[0].userType == 2){
                  
                    coachrangeName = rangeresults[0].rangeName;

                    let sqlshooter = "SELECT * FROM `users` WHERE `userEmail` = ? " ;
                    let queryshooter = db.query(sqlshooter, [userEmail], (err, shooterresults) => {
                    if (err) throw err;

                    if(shooterresults.length == 0){
                      res.json({
                        message : "user not found"
                      })
                    }else{
            
                    
                    if(shooterresults[0].isActive ==0){
                      res.json({
                        message : "user is not register"
                      })
                    }

                    if(shooterresults[0].isApproved == 0){

                      res.json({
                        message : "shooter is not approved by admin"
                      })
                    }
                    shooterrangeName = shooterresults[0].rangeName;
                    rangeName = coachrangeName;

                    
                    if(coachrangeName = shooterrangeName){

                      isActive = 1


                      // check user is isActive and isApproved
                        

                        

                        var data = {userEmail , laneNo , bookDate , startTime , isActive , rangeName};

                        let sqlfind = "SELECT bookDate , laneNo , startTime FROM slotbooking WHERE isActive = 1 AND rangeName = ?";
                        let query = db.query(sqlfind, [coachrangeName], (err, slotresults) => {
                        if (err) throw err;
                        console.log(slotresults);
              
                        // if empty
                        if(slotresults.length==0){



                          let sqlcheckLane = "SELECT isActive FROM lane_master WHERE rangeName = ? AND laneNO = ? ";
                          let query = db.query(sqlcheckLane, [ rangeName, laneNo], (err, checklaneresults) => {
                            if (err) throw err;
                            console.log(checklaneresults);
                          
                            if(checklaneresults.length==0){

                              let sqlslot = "INSERT INTO slotbooking SET ?";

                              let queryslot = db.query(sqlslot, data, (err, stresults) => {
                                if (err) throw err;
                                console.log(stresults);
                                res.json({
                                  message: "success",
                                });
                              });


                            }else{
                            if(checklaneresults[0].isActive ==0){
                              res.json({
                                message : "this lane is unactivated by admin"
                              })
                            }else{

                              let sqlslot = "INSERT INTO slotbooking SET ?";

                              let queryslot = db.query(sqlslot, data, (err, stresults) => {
                                if (err) throw err;
                                console.log(stresults);
                                res.json({
                                  message: "success",
                                });
                              });


                            }
                          }


                          });


                          
                        }else{
                       
                        lengthresults = slotresults.length
                        console.log(lengthresults)
                        console.log(slotresults[0].bookDate )
              
                        
              
                        for(i = 0 ; i<lengthresults ; i++){
                            console.log(i)
                           
                          if(date == slotresults[i].bookDate && laneNo == slotresults[i].laneNo && startTime == slotresults[i].startTime ){
                            var booking = "no"
                            console.log("nooo");
                          }
                        }
              
                        if (booking == "no"){
                          res.json({message : "this slot is not empty"})
                          booking = "yes"
              
                        }else{

                          let sqlcheckLane = "SELECT isActive FROM lane_master WHERE rangeName = ? AND laneNO = ? ";
                          let query = db.query(sqlcheckLane, [ rangeName, laneNo], (err, checklaneresults) => {
                            if (err) throw err;
                            console.log(checklaneresults);
                          
                            if(checklaneresults.length==0){

                              let sqlslot = "INSERT INTO slotbooking SET ?";

                              let queryslot = db.query(sqlslot, data, (err, stresults) => {
                                if (err) throw err;
                                console.log(stresults);
                                res.json({
                                  message: "success",
                                });
                              });


                            }else{
                            if(checklaneresults[0].isActive ==0){
                              res.json({
                                message : "this lane is unactivated by admin"
                              })
                            }else{

                              let sqlslot = "INSERT INTO slotbooking SET ?";

                              let queryslot = db.query(sqlslot, data, (err, stresults) => {
                                if (err) throw err;
                                console.log(stresults);
                                res.json({
                                  message: "success",
                                });
                              });


                            }
                          }


                          });


              
                          
              
                        }
                        
              
                      }
                        });

                      

                    }else {

                      res.json({
                        messsge : "user is not able to shoot in this range "
                      })
                    }
                      


            



                    

                    
                  }
                    })



                  
                  }
                  else {
                    res.json({message : "you are not allow to to book "})
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


}