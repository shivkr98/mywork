const db = require("../../../database/db");
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../../../configuration/key");
var jwt_Decode = require("jwt-decode");
const { json } = require('body-parser');


module.exports ={
    

    unActivelane : async  (req ,res) =>{

      var {laneNo} = req.body;
      var isActive = 0;
      var deactivationDate = new Date();

      const token = req.headers["authorization"];

        
      jwt.verify(token, "shootingauthentication", function (err, currUser) {
        if (err) {
          res.send(err);
          console.log("not verified")
        } else {
          // decoded object
          req.currUser = currUser;
          console.log("verified")
         
           var decoded = jwt_Decode(token);
           Email = decoded.sub.e;

            let sqlrange = "SELECT rangeName FROM users WHERE userEmail = ?";
            let query = db.query(sqlrange, [Email], (err, Rangeresults) => {
                if (err) throw err;
                console.log(Rangeresults);

                rangeName = Rangeresults[0].rangeName;

                //check this no of lane range have or not

              let sqlrangeCheck = "SELECT noLanes FROM range_master WHERE rangeName - ? ";
              let query = db.query(sqlrangeCheck, [rangeName], (err, rangeCheckresults) => {
                if (err) throw err;
                console.log(rangeCheckresults);

                if(rangeCheckresults[0]  < laneNo) {

                  res.json({
                    message : "you do not hava this lane"
                  })
                }
                else {



                  let sqllane = "SELECT laneNo , isActive FROM lane_master WHERE rangeName = ?";
                  let query = db.query(sqllane, [rangeName], (err, laneresults) => {
                    if (err) throw err;
                    console.log(laneresults);
                    if (laneresults.length == 0) {

                      var data = { rangeName, laneNo, isActive, deactivationDate }

                      // put the code to insert
                      let sqlunactive = "INSERT INTO lane_master SET ?";
                      let query = db.query(sqlunactive, data, (err, results) => {
                        if (err) throw err;
                        console.log(results);
                        res.json({
                          message: "Lane successfully deactivated",
                        });
                      });



                    }
                    else {

                      lent =  laneresults.length;
                      console.log(lent)
                      for(i =0;i<lent;i++){

                        if(i == lent-1){
                          console.log("jaiii")


                          if(laneresults[i].laneNo == laneNo) {

                            if(laneresults[i].isActive == 0){
                              res.json({
                                message : "this lane is aready unactive"
                              })
                              
                              break;
                              
                            }else{
  
                              let sqlchengeActive = "UPDATE lane_master SET isActive = 0 ,	deactivationDate = ? WHERE rangeName = ? AND laneNo =?";
                              let query = db.query(sqlchengeActive, [deactivationDate,rangeName , laneNo], (err, changeresults) => {
                                if (err) throw err;
                                console.log(changeresults);
                                res.json({
                                  message: "Lane successfully deactivated",
                                });
                              });
  
  
  
  
                              break;
  
  
                            }
  
                          }else {

                            var data = { rangeName, laneNo, isActive, deactivationDate }

                            // put the code to insert
                            let sqlunactive = "INSERT INTO lane_master SET ?";
                            let query = db.query(sqlunactive, data, (err, results) => {
                              if (err) throw err;
                              console.log(results);
                              res.json({
                                message: "Lane successfully deactivated",
                              });
                            });
                          }





                        }



                       

                        if(laneresults[i].laneNo == laneNo) {

                          if(laneresults[i].isActive == 0){
                            res.json({
                              message : "this lane is aready unactive"
                            })
                            
                            break;
                            
                          }else{

                            let sqlchengeActive = "UPDATE lane_master SET isActive = 0 ,	deactivationDate= ? WHERE rangeName = ? AND laneNo = ?";
                            let query = db.query(sqlchengeActive, [deactivationDate,rangeName , laneNo] , (err, changeresults) => {
                              if (err) throw err;
                              console.log(changeresults);
                              res.json({
                                message: "Lane successfully deactivated",
                              });
                            });




                            break;


                          }

                        }
                       
                        





                      }
                      




                    }




                  });




                }
               



              });








                


                
                
            });






        }
      })


    },
    Activelane : async  (req ,res) =>{

      var {laneNo} = req.body;
      var isActive = 1;
      var activationDate = new Date();

      const token = req.headers["authorization"];

        
      jwt.verify(token, "shootingauthentication", function (err, currUser) {
        if (err) {
          res.send(err);
          console.log("not verified")
        } else {
          // decoded object
          req.currUser = currUser;
          console.log("verified")
         
           var decoded = jwt_Decode(token);
           Email = decoded.sub.e;

            let sqlrange = "SELECT rangeName FROM users WHERE userEmail = ?";
            let query = db.query(sqlrange, [Email], (err, Rangeresults) => {
                if (err) throw err;
                console.log(Rangeresults);

                rangeName = Rangeresults[0].rangeName;

                //check this no of lane range have or not

              let sqlrangeCheck = "SELECT noLanes FROM range_master WHERE rangeName - ? ";
              let query = db.query(sqlrangeCheck, [rangeName], (err, rangeCheckresults) => {
                if (err) throw err;
                console.log(rangeCheckresults);

                if(rangeCheckresults[0]  < laneNo) {

                  res.json({
                    message : "you do not hava this lane"
                  })
                }
                else {



                  let sqllane = "SELECT laneNO , isActive FROM lane_master WHERE rangeName = ?";
                  let query = db.query(sqllane, [rangeName], (err, laneresults) => {
                    if (err) throw err;
                    console.log(laneresults);
                    if (laneresults.length == 0) {

                      res.json({
                        message : "lane is already active"
                      })

                     



                    }
                    else {

                      lent =  laneresults.length;
                      console.log(lent)
                      for(i =0;i<lent;i++){
                        console.log(laneresults[i].laneNO)

                        if(i == lent-1){

                          if(laneresults[i].laneNO == laneNo) {

                            if(laneresults[i].isActive == 1){
                              res.json({
                                message : "this lane is aready active"
                              })
                              
                              break;
                              
                            }else{
  
                              let sqlchengeActive = "UPDATE lane_master SET isActive = 1, activationData = ? WHERE rangeName = ?";
                              let query = db.query(sqlchengeActive, [activationDate,rangeName], (err, changeresults) => {
                                if (err) throw err;
                                console.log(changeresults);
                                res.json({
                                  message: "Lane successfully activated",
                                });
                              });
  
  
  
  
                              break;
  
  
                            }
  
                            
  
                           
  
                          }
                         
                          




                          res.json({
                            message : "this lane is aready active"
                          })


                        }






                        if(laneresults[i].laneNO == laneNo) {

                          if(laneresults[i].isActive == 1){
                            res.json({
                              message : "this lane is aready active"
                            })
                            
                            break;
                            
                          }else{

                            let sqlchengeActive = "UPDATE lane_master SET isActive = 1, activationData = ? WHERE rangeName = ?";
                            let query = db.query(sqlchengeActive, [activationDate,rangeName], (err, changeresults) => {
                              if (err) throw err;
                              console.log(changeresults);
                              res.json({
                                message: "Lane successfully activated",
                              });
                            });




                            break;


                          }

                          

                         

                        }
                        
                        
                        





                      }
                      




                    }




                  });




                }
               



              });








                


                
                
            });






        }
      })


    }


    


    

}