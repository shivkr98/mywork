const db = require("../../database/db");
var jwt = require("jsonwebtoken");
const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configuration/key");
var jwt_Decode = require("jwt-decode");


module.exports = {

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

    bookSlot:(req ,res)=>{

      var {laneNo , bookDate , startTime} = req.body;
      isActive = 1;
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
            userEmail = email

            let sqlrange = "SELECT rangeName FROM users WHERE userEmail = ?";
            let queryrange = db.query(sqlrange, [email], (err, rangeresults) => {
          if (err) throw err;
          rangeName = rangeresults[0].rangeName
          console.log(rangeName)

              //check lane is active or not

              let sqlcheckActive = "SELECT isActive FROM lane_master WHERE rangeName =? AND laneNo = ?";
              let query = db.query(sqlcheckActive, [rangeName , laneNo], (err, activeresults) => {
                if (err) throw err;
                
                if(activeresults.length == 0){



                }else {


                isactive = activeresults[0].isActive;

                if(isactive == 1){
                  

                  var data = { userEmail, laneNo, bookDate, startTime, isActive, rangeName }

                  let sqlfind = "SELECT * FROM slotbooking WHERE isActive = 1 AND rangeName = ?";
                  let query = db.query(sqlfind, [rangeName], (err, results) => {
                    if (err) throw err;
                    console.log(results);

                    // if empty
                    if (results.length == 0) {

                      //check no_session ot timing avilabe or not

                      let sqlcheck = "SELECT no_sessions , fromTime , toTime FROM profile WHERE profileEmail = ?";
                      let querycheck = db.query(sqlcheck, [userEmail], (err, checkresult) => {
                        if (err) throw err;
                        console.log(checkresult);

                        no_sessions = checkresult[0].no_sessions;
                        formTime = checkresult[0].fromTime;
                        toTime = checkresult[0].toTime;

                        lastDate = new Date(toTime).valueOf();
                        currentDate = new Date().valueOf();
                        if (no_sessions == 0) {
                          res.json({
                            message: "No sessions remain"
                          })
                        }
                        if (currentDate > lastDate) {
                          res.json(
                            { message: "your package has been expired" }

                          )
                        } else {


                          let sqlslot = "INSERT INTO slotbooking SET ?";
                          let queryslot = db.query(sqlslot, data, (err, slotresult) => {
                            if (err) throw err;
                            console.log(slotresult);
                            res.json({
                              message: "success",
                            });
                          });



                        }






                      });




                    } else {

                      lengthresults = results.length
                      console.log(lengthresults)



                      for (i = 0; i < lengthresults; i++) {
                       

                         

                        if (bookDate == results[i].bookDate && laneNo == results[i].laneNo && startTime == results[i].startTime) {
                          var booking = "no";
                          console.log(booking)
                          console.log("nooo");
                        }
                      }
                      console.log("sfaf" + booking)
                      if (booking == "no") {
                        res.json({ message: "this slot is not empty" });  
                        booking = "yes"

                      } else {
                        

                        //
                        let sqlcheck = "SELECT no_sessions , fromTime , toTime FROM profile WHERE profileEmail = ?";
                        let querycheck = db.query(sqlcheck, [userEmail], (err, checkresult) => {
                          if (err) throw err;
                          console.log(checkresult);

                          if(checkresult.length == 0){
                            res.json({
                              message : "profile is not created please create your profile"
                            })
                          }

                          var no_sessions = checkresult[0].no_sessions;
                          var formTime = checkresult[0].fromTime;
                          var toTime = checkresult[0].toTime;

                          lastDate = new Date(toTime).valueOf();
                          currentDate = new Date().valueOf();
                          if (no_sessions == 0) {
                            res.json({
                              message: "No sessions remain"
                            })
                          }
                          if (currentDate > lastDate) {
                            res.json(
                              { message: "your package has been expired" }

                            )
                          } else {


                            let sqlslot = "INSERT INTO slotbooking SET ?";
                            let queryslot = db.query(sqlslot, data, (err, slotresult) => {
                              if (err) throw err;
                              console.log(slotresult);
                              res.json({
                                message: "success",
                              });
                            });



                          }






                        });



                      }


                    }
                  });





                }else {

                  res.json({

                    message : "this lane is not active"
                  })
                }
              }

              });



          
          
          
          
          
          
          
         
          


        });
      }




            
        
      });
      console.log(token)
    }

    },


    showMybooking: (req , res)=>{

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
   
           userEmail = decoded.sub.e;



           let sqlslot = "SELECT Date , startTime , laneNo FROM slotbooking where userEmail= ? ";
           let queryslot = db.query(sqlslot, [userEmail], (err, slotresults) => {
             if (err) throw err;
             res.json({message : slotresults})
             
             
           });




        }
      });
      console.log(token)
    }



    },

    removeBooking: (req, res)=>{

      var {laneNo , Date , startTime} = req.body;

      
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
   
           userEmail = decoded.sub.e;

           let sqlrange = "SELECT rangeName FROM users WHERE userEmail = ?";
          let queryrange = db.query(sqlrange, [userEmail], (err, rangeresults) => {
          if (err) throw err;
          console.log(rangeresults);
          rangeName = rangeresults[0].rangeName;
          console.log(rangeName)
          

          let sqlslot = "SELECT * FROM slotbooking WHERE laneNo = ? AND bookDate = ? AND startTime =  ? AND rangeName = ? ";
          let queryslot = db.query(sqlslot, [laneNo , Date ,startTime , rangeName ], (err, slotresults) => {
          if (err) throw err;
          console.log(slotresults);

         
          if (slotresults.length > 0){
            let sqldeleteslot = "UPDATE `slotbooking` SET `isActive` = 0 WHERE  laneNo = ? AND bookDate = ? AND startTime =  ? AND rangeName = ?";
            let query = db.query(sqldeleteslot, [laneNo , Date ,startTime , rangeName ], (err, deleteresults) => {
              if (err) throw err;
              console.log(deleteresults);

              res.json({message : "succesfully deleted you slot"})
             
            });

          }else {
            res.json({
              message : "no slot is booked at this time"
            })
          }
         
          
          
        });

          
          });


           




        }
      });
      console.log(token)
    }





    }



}