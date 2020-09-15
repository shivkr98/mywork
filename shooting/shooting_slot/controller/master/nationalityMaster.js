const db = require('../../database/db')

module.exports={
   addNationality : async (req ,res ) => {
    var {
        nationality,
        createdBy,
        modifiedBy
        
    } = req.body
    var createdOn = new Date()
    var modifiedOn = null

    isActive = 1
    var data = {
        nationality,
        createdBy,
        createdOn,
        modifiedBy,
        modifiedOn,
        isActive
    }

    db.query("SELECT * FROM nationality_master WHERE nationality = ?", [nationality], async function (
        error,
        results
      ) {
        console.log(results.length);
        if (results.length > 0) {
          res.json({
            message: "nationality already exist",
          });
        } else {
          let sqlRegister = "INSERT INTO nationality_master SET ?";
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

   showNationality : async(req, res) => {

    let sqlRegister = "SELECT  `nationality` FROM `nationality_master` WHERE ` nationality_master`.`isActive` = 1 ";
    let query = db.query(sqlRegister, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.json({
          message: "Success",
          results: results
         
          
        });
      });



   },

   updateNationality : async(req, res) => {

     var {nationality , id} = req.body;
     var modifiedOn = new Date()

    var sql = "UPDATE `nationality_master` SET `nationality` = ? , `modifiedOn` = ? WHERE `nationality_master`.`id` = ?";
 
    

    console.log(sql)
    
    let query = db.query(sql, [nationality , modifiedOn, id] ,(err, results) => {
      
      if (err) throw err;
      console.log(results);
      res.json({
        message: "Success updated",
        
       
        
      });
    }
  
 )},

   deleteNationality : async(req, res) => {

    var { id} = req.body;
    var modifiedOn = new Date()

    var sql = "UPDATE `nationality_master` SET `isActive` = 0 , `modifiedOn` = ? WHERE `nationality_master`.`id` = ?";

    

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