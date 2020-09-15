const db = require('../../database/db')

module.exports={
   addUserType : async (req ,res ) => {
    var {
        userTypeName,
        createdBy,
        modifiedBy
        
    } = req.body
    var createdOn = new Date()
    var modifiedOn = null

    isActive = 1
    var data = {
        userTypeName,
        createdBy,
        createdOn,
        modifiedBy,
        modifiedOn,
        isActive
    }

    db.query("SELECT * FROM userType_master WHERE userTypeName = ?", [userTypeName], async function (
        error,
        results
      ) {
        console.log(results.length);
        if (results.length > 0) {
          res.json({
            message: "user type already exist",
          });
        } else {
          let sqlRegister = "INSERT INTO userType_master SET ?";
          let query = db.query(sqlRegister, data, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.json({
              message: "success",
            });
          });
        }
      });



   },

   showUserType : async(req, res) => {

    let sqlRegister = "SELECT  `userTypeName` FROM `userType_master` WHERE ` userType_master`.`isActive` = 1 ";
    let query = db.query(sqlRegister, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.json({
          message: "Success",
          results: results
         
          
        });
      });



   },

   updateUserType : async(req, res) => {

     var {userTypeName , id} = req.body;
     var modifiedOn = new Date()

    var sql = "UPDATE `userType_master` SET `userTypeName` = ? , `modifiedOn` = ? WHERE `userType_master`.`id` = ?";
 
    

    console.log(sql)
    
    let query = db.query(sql, [userTypeName , modifiedOn, id] ,(err, results) => {
      
      if (err) throw err;
      console.log(results);
      res.json({
        message: "Success updated",
        
       
        
      });
    }
  
 )},

   deleteUserType : async(req, res) => {

    var { id} = req.body;
    var modifiedOn = new Date()

    var sql = "UPDATE `userType_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `userType_master`.`id` = ?";

    

    console.log(sql)
    
    let query = db.query(sql, [modifiedOn,id] ,(err, results) => {
      
      if (err) throw err;
      console.log(results);
      res.json({
        message: "Successfully deleted ",
        
       
        
      });
    }
  
 )
   }
}