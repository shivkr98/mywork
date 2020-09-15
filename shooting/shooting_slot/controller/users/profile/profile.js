const db = require('../../../database/db')
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../../configuration/key");
var jwt_Decode = require("jwt-decode");

const fs = require("fs")

deployLink = "http://localhost:3000/"

module.exports = {

     var : a = null,
    

 // SHow Profile

    showProfile : async (req ,res ) => {

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
                    profileEmail = decoded.sub.e;
                    console.log(profileEmail)

                // here we impliment the code  

                
                let sql =  "SELECT `profile`.`profileName`,`profile`.`profilePhoto`,`profile`.`motherName`,`profile`.`fatherName`,`profile`.`profileGender`,`profile`.`profileDob`,`profile`.`Organization`,`profile`.`createdBy`,`profile`.`modifiedOn` ,`profile`.`modifiedBy`,`profile`.`Role`,`profile`.`profileNationality`,`profile`.`profileOccupation`,`profile`.`profileQual`,`profile`.`profileEmail`,`profile`.`secondaryMobnum`,`profile`.`recoveryEmail`,`profile`.`profileMobnum` ,`profile`.`createdOn` ,`profile`.`isActive` ,`profile`.`profileType` ,`profile`.`isApproved`,`address`.`addressId`, `address`.`addressEmail`, `address`.`houseNo`, `address`.`Locality`, `address`.`Landmark`, `address`.`City`, `address`.`State`, `address`.`Postalcode`, `address`.`createdOn`, `address`.`createdBy`, `address`.`modifiedOn`, `address`.`modifiedBy`, `address`.`isActive` FROM `profile` INNER JOIN `address` ON `profileEmail` = `addressEmail` WHERE `profile`.`isActive` = 1 AND  `profileEmail` = ?   " ;
                let query_profile = db.query(sql, [profileEmail], (err, results) => {
                if (err) throw err;
                    console.log(results[0])
                    if (results.length >0){
                        res.json({results : results})
                    }else{
                        res.json({message : "no profile exist"})
                    }
                        
                });     
                
                // next();
              }
            });
            console.log(token)
          }else {
              res.json({
                  message : "you are not authorized"
              })
          }
    },



    upd_ins_Profile : async (req ,res ) => {




      const token = req.headers["authorization"];
    // console.log(token);
     


      var {
         
        motherName, 
        fatherName, 
        profilePhoto, 
        profileGender,
        profileDob, 
        profileNationality, 
        profileOccupation, 
        profileQual, 
        recoveryEmail, 
        secondaryMobnum, 
        Organization, 
        createdBy,
        houseNo,
        Locality,
        Landmark, 
        City, 
        State, 
        Postalcode} = req.body
        
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
                    profileEmail = decoded.sub.e;
                    console.log(profileEmail)

                    let sql =  "SELECT * FROM profile WHERE profileEmail = ?" 
                    let query_profile = db.query(sql, [profileEmail], (err, results) => {
                      if (err) throw err;
                      
                      if(results.length == 0){
              
                        var addressEmail = profileEmail
                           
                        var createdOn = new Date()
                        var modifiedOn = null
                        var modifiedBy= null
                        let sqlRegister = "SELECT `userName`, `userMobnum` , `createdOn` , `isActive` , `userType` , `isApproved`  FROM `users` WHERE `users`.`isActive` = 1 AND `users`.`userEmail`  = ? " ;
                        let query = db.query(sqlRegister, [profileEmail], (err, results1 )  => {
                        if (err) throw err;
                          
                        
                       
                              
                           
                              console.log(results1)
                              profileName = results1[0].userName;
                              
                      
                           
                              profileMobnum = results1[0].userMobnum
                              console.log(profileMobnum)
                              
                              createdOn = results1[0].createdOn
                              console.log(createdOn)
                      
                              isActive = results1[0].isActive
                              console.log(isActive)
                              
                              userType = results1[0].userType
                              console.log(userType)
                              Role = userType       
                              profileType = userType
                                 
                              createdBy = profileName
                      
                              isApproved = results1[0].isApproved
                              console.log(isApproved)
                
                
                              if(profilePhoto == null ){

                                profilePhoto = profilePhoto;

                              }else{

                                let buff = Buffer.from(profilePhoto, 'base64');
                                name = profileName +new Date().getTime()+".png";
                                
                                
                                fs.writeFile('./uploads/'+name, buff, (err) => {
                                if (err) throw err;
                                console.log('The binary data has been decoded and saved to my-file.png');
                                  });


                                 profilePhoto = deployLink + name; 
                              }
                
                              
                               
                          
                            var data = {
                         
                                profilePhoto, 
                                profileName, 
                                motherName, 
                                fatherName, 
                                profileGender,
                                profileDob, 
                                profileNationality, 
                                profileOccupation, 
                                profileQual, 
                                profileEmail, 
                                profileMobnum, 
                                recoveryEmail, 
                                secondaryMobnum, 
                                Organization,  
                                createdOn, 
                                createdBy, 
                                modifiedOn, 
                                modifiedBy, 
                                Role, 
                                isActive, 
                                isApproved, 
                                profileType,
                                
                    
                            }
                            
                            
                
                
                    
                            let sql = "INSERT INTO profile SET ?";
                            let query_profile = db.query(sql, data, (err, results) => {
                              if (err) throw err;
                              console.log(results);
                              res.json({
                                message: "success",
                
                                
                                
                              });
                            });
                
                            var data_address = {
                              addressEmail,
                              houseNo,
                              Locality,
                              Landmark, 
                              City, 
                              State, 
                              Postalcode,
                              createdOn,
                              createdBy,
                              modifiedOn,
                              modifiedBy,
                              isActive
                          }
                          let sqladdress = "INSERT INTO address SET ?";
                            let query_address = db.query(sqladdress, data_address, (err, result_address) => {
                              if (err) throw err;
                             
                              
                            });
                          });
              
                      }else{
                        //update work
                        var addressEmail = profileEmail
                        
                        var isActive = 1
                        var modifiedOn = new Date()
                      
                        let sqlRegister = "SELECT `userName`, `userMobnum` , `createdOn` , `isActive` , `userType` , `isApproved`  FROM `users` WHERE `users`.`userEmail`  = ? " ;
                        let query = db.query(sqlRegister, [profileEmail], (err, results1 )  => {
                        if (err) throw err;
                          
                        
                        
                        
                              
                           
                              console.log(results1)
                              profileName = results1[0].userName;

                              
                                                      
                              
                              modifiedBy = profileName;
                           
                              profileMobnum = results1[0].userMobnum
                              console.log(profileMobnum)
                              
                              createdOn = results1[0].createdOn
                              console.log(createdOn)
                      
                              isActive = results1[0].isActive
                              console.log(isActive)
                              
                              userType = results1[0].userType
                              console.log(userType)
                              Role = userType       
                              profileType = userType
                                 
                              createdBy = profileName
                      
                              isApproved = results1[0].isApproved
                              console.log(isApproved)
                
                

                            if(profilePhoto == null) {


                              var data = {
                         
                                // profilePhoto, 
                                profileName, 
                                motherName, 
                                fatherName, 
                                profileGender,
                                profileDob, 
                                profileNationality, 
                                profileOccupation, 
                                profileQual, 
                                // profileEmail, 
                                profileMobnum, 
                                recoveryEmail, 
                                secondaryMobnum, 
                                Organization,  
                                modifiedOn, 
                                modifiedBy, 
                                // Role, 
                                isActive, 
                                // isApproved, 
                                // profileType,
                                
                    
                            }
                            
                            
                
                
                    
                            let sql = "UPDATE `profile` SET ? WHERE `profile`.`profileEmail` = ?";
                            let query_profile = db.query(sql,[data , profileEmail], (err, results) => {
                              if (err) throw err;
                              console.log(results);
                              res.json({
                                message: "success",
                
                                
                                
                              });
                            });

                            var data_address = {
                              // addressEmail,
                              houseNo,
                              Locality,
                              Landmark, 
                              City, 
                              State, 
                              Postalcode,
                              modifiedOn,
                              modifiedBy,
                              isActive
                            }
                            let sqladdress = "UPDATE `address` SET ?";
                            let query_address = db.query(sqladdress, data_address, (err, result_address) => {
                              if (err) throw err;
                             
                              
                            });




                            }else {


                              let buff = Buffer.from(profilePhoto, 'base64');
                                name = profileName +new Date().getTime()+".png";
                                
                                
                                fs.writeFile('./uploads/'+name, buff, (err) => {
                                if (err) throw err;
                                console.log('The binary data has been decoded and saved to my-file.png');
                                  });


                                 profilePhoto = deployLink + name;


                                 var data = {
                         
                                  profilePhoto, 
                                  profileName, 
                                  motherName, 
                                  fatherName, 
                                  profileGender,
                                  profileDob, 
                                  profileNationality, 
                                  profileOccupation, 
                                  profileQual, 
                                  
                                  profileMobnum, 
                                  recoveryEmail, 
                                  secondaryMobnum, 
                                  Organization,  
                                  modifiedOn, 
                                  modifiedBy,  
                                  isActive 
                                  
                                  
                      
                              }
                              
                              
                  
                  
                      
                              let sql = "UPDATE `profile` SET ? WHERE `profile`.`profileEmail` = ?";
                              let query_profile = db.query(sql,[data , profileEmail], (err, results) => {
                                if (err) throw err;
                                console.log(results);
                                res.json({
                                  message: "success",
                  
                                  
                                  
                                });
                              });
  
                              var data_address = {
                                // addressEmail,
                                houseNo,
                                Locality,
                                Landmark, 
                                City, 
                                State, 
                                Postalcode,
                                modifiedOn,
                                modifiedBy,
                                isActive
                              }
                              let sqladdress = "UPDATE `address` SET ?";
                              let query_address = db.query(sqladdress, data_address, (err, result_address) => {
                                if (err) throw err;
                               
                                
                              });
                              



                            }
                              
                            
                        
                          
                
                            
                          });
              
              
                      }
                    });  





                // next();
              }
            });
            console.log(token)
          }else {
            res.json({
                message : "you are not authorized"
            })

          }
      
    },

    // doudt delete profile admine hi karega

    deleteProfile : async (req ,res ) => {

    
      
    var isActive = 0  
      
    var modifiedOn = new Date()

    var data = {
      isActive,
      modifiedOn,
    }

   
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
                let sql = "UPDATE `profile` SET ? WHERE userEmail = ?";
                let query_profile = db.query(sql, [data ,email ], (err, results) => {
                if (err) throw err;
                console.log(results);
              res.json({
                message: "success",

        
        
               });
    });


           
          }
        });
        console.log(token)
      }else{
          json({message : "you are not authorized"})
      }

   
   
        
       
        
      
    
  
 }

}