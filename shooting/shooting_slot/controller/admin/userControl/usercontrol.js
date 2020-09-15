const db = require("../../../database/db");
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../../../configuration/key");
var jwt_Decode = require("jwt-decode");
const { json } = require('body-parser');

module.exports = {

    approveUser :(req, res)=>{

        var {userEmail} = req.body;
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
             Email = decoded.sub.e 

             let sqlcheckadmin = "SELECT * FROM users WHERE userEmail = ?";
              let checkquery = db.query(sqlcheckadmin, [Email], (err, results) => {
              if (err) throw err;
           
              adminrange = results[0].rangeName

              if (results[0].userType == 0){

                let sqluser = "SELECT * FROM users WHERE userEmail = ?";
                let userquary = db.query(sqluser  , [userEmail] , (err , usersresutls) => {

                  if(err) throw err;
                  if (!usersresutls){
                    res.json(
                        { message : "email id not exist" })
                  }
                  else {

                    userrange= usersresutls[0].rangeName
                  
                  if(adminrange == userrange){

                    db.query("SELECT * FROM users WHERE userEmail = ?", [userEmail], async function (
                      error,
                      usersresults
                    ) {
                      if (error) {
                        res.json({
                          message: error,
                        });
                      } else {
                        

                        if (usersresults[0].isApproved == 1){
                          res.json({
                            message : "user already approved"
                          })

                        }else {
                              var sql = "UPDATE `users` SET `isApproved` = 1  WHERE `users`.`userEmail` = ?";                        
                              let query = db.query(sql, [userEmail] ,(err, results) => {
                                
                                if (err) throw err;
                                
                                res.json({
                                  message: "user approved success ",
                               
                                });
                              }
                           )} 
                      }
                    });
                  }
                  else {
                    res.json({
                      message : "you are not authoriezed to approved this range users"
                    })
                  }
                    
                  }

                  

                })

              }
               
              

              
            });
             
             
           
        } 
        })
    },

    refuseUser :(req, res)=>{

      var {userEmail} = req.body;
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
           Email = decoded.sub.e 

           let sqlcheckadmin = "SELECT * FROM users WHERE userEmail = ?";
            let checkquery = db.query(sqlcheckadmin, [Email], (err, results) => {
            if (err) throw err;
           
            adminrange = results[0].rangeName

            if (results[0].userType == 0){

              let sqluser = "SELECT * FROM users WHERE userEmail = ?";
              let userquary = db.query(sqluser  , [userEmail] , (err , usersresutls) => {

                if(err) throw err;
                if (!usersresutls){
                  res.json(
                      { message : "email id not exist" })
                }
                else {

                  userrange= usersresutls[0].rangeName
                
                if(adminrange == userrange){

                  db.query("SELECT * FROM users WHERE userEmail = ?", [userEmail], async function (
                    error,
                    usersresults
                  ) {
                    if (error) {
                      res.json({
                        message: error,
                      });
                    } else {
                      if (usersresults[0].isApproved == 0){
                        res.json({
                          message : "user already unapprove"
                        })

                      }else {
                            var sql = "UPDATE `users` SET `isApproved` = 0  WHERE `users`.`userEmail` = ?";                        
                            let query = db.query(sql, [userEmail] ,(err, results) => {
                              
                              if (err) throw err;
                              res.json({
                                message: "user unapprove success ",
                             
                              });
                            }
                         )} 
                    }
                  });
                }
                else {
                  res.json({
                    message : "you are not authoriezed to approved this range users"
                  })
                }
                  
                }

                

              })

            }
             
            

            
          });
           
           
         
      } 
      })
    }
  }   