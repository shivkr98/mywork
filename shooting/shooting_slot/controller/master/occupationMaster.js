const db = require('../../database/db')

module.exports={
   addOccupation : async (req ,res ) => {
    var {
        occupation,
        createdBy,
        modifiedBy
        
    } = req.body
    var createdOn = new Date()
    var modifiedOn = null

    isActive = 1
    var data = {
        occupation,
        createdBy,
        createdOn,
        modifiedBy,
        modifiedOn,
        isActive
    }

    db.query("SELECT * FROM occupation_master WHERE occupation = ?", [occupation], async function (
        error,
        results
      ) {
        console.log(results.length);
        if (results.length > 0) {
          res.json({
            message: " occupation already exist",
          });
        } else {
          let sqlRegister = "INSERT INTO occupation_master SET ?";
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

   showOccupation : async(req, res) => {

    let sqlRegister = "SELECT  `occupation` FROM `occupation_master` WHERE `occupation_master`.`isActive` = 1 ";
    let query = db.query(sqlRegister, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.json({
          message: "Success",
          results: results
         
          
        });
      });



   },

   updateOccupation : async(req, res) => {

     var {occupation , id} = req.body;
     var modifiedOn = new Date()

    var sql = "UPDATE `occupation_master` SET `occupation` = ? , `modifiedOn` = ? WHERE `occupation_master`.`id` = ?";
 
    

    console.log(sql)
    
    let query = db.query(sql, [occupation , modifiedOn, id] ,(err, results) => {
      
      if (err) throw err;
      console.log(results);
      res.json({
        message: "Success updated",
        
       
        
      });
    }
  
 )},

   deleteOccupation : async(req, res) => {

    var { id} = req.body;
    var modifiedOn = new Date()

    var sql = "UPDATE `occupation_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `occupation_master`.`id` = ?";

    

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