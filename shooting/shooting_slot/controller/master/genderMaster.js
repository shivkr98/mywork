const db = require('../../database/db')

module.exports={
   add : async (req ,res ) => {
    var {
        genderTypeName,
        createdBy,
        modifiedBy
        
    } = req.body
    var createdOn = new Date()
    var modifiedOn = null

    isActive = 1
    var data = {
        genderTypeName,
        createdBy,
        createdOn,
        modifiedBy,
        modifiedOn,
        isActive
    }

    db.query("SELECT * FROM gender_master WHERE genderTypeName = ?", [genderTypeName], async function (
        error,
        results
      ) {
        console.log(results.length);
        if (results.length > 0) {
          res.json({
            message: "gender already exist",
          });
        } else {
          let sqlRegister = "INSERT INTO gender_master SET ?";
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

   show : async(req, res) => {

    let sqlRegister = "SELECT  `genderTypeName` FROM `gender_master` WHERE `gender_master`.`isActive` = 1 ";
    let query = db.query(sqlRegister, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.json({
          message: "Success",
          results: results
         
          
        });
      });



   },

   update : async(req, res) => {

     var {genderTypeName , id} = req.body;
     var modifiedOn = new Date()

    var sql = "UPDATE `gender_master` SET `genderTypeName` = ? , `modifiedOn` = ? WHERE `gender_master`.`id` = ?";
 
    

    console.log(sql)
    
    let query = db.query(sql, [genderTypeName , modifiedOn, id] ,(err, results) => {
      
      if (err) throw err;
      console.log(results);
      res.json({
        message: "Success updated",
        
       
        
      });
    }
  
 )},

   delete : async(req, res) => {

    var { id} = req.body;
    var modifiedOn = new Date()

    var sql = "UPDATE `gender_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `gender_master`.`id` = ?";

    

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