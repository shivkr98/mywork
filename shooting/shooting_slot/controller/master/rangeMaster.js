const db = require('../../database/db')

module.exports={
   add : async (req ,res ) => {
    var {
        rangeName,
        rangeEmail,
        ownerName,
        rangeContact,
        rangeTimings,
        rangeDays,
        closeRange,
        noLanes,
        createdBy,

        
    } = req.body
    var createdOn = new Date()
    var modifiedOn = null

    isActive = 1
    var data = {
        rangeName,
        rangeEmail,
        ownerName,
        rangeContact,
        rangeTimings,
        rangeDays,
        closeRange,
        noLanes,
        createdBy,
        createdBy,
        createdOn,
        modifiedBy,
        modifiedOn,
        isActive
    }

    db.query("SELECT * FROM range_master WHERE rangeName = ?", [rangeName], async function (
        error,
        results
      ) {
        console.log(results.length);
        if (results.length > 0) {
          res.json({
            message: "range already exist",
          });
        } else {
          let sqlRegister = "INSERT INTO range_master SET ?";
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

    let sqlRegister = "SELECT  `rangeName` ,  rangeName,`rangeEmail`,`ownerName`,`rangeContact`,`rangeTimings`,`rangeDays`,`closeRange`,`noLanes`,`createdBy`,`createdBy`,`createdOn`,`modifiedBy`,`modifiedOn` FROM `range_master` WHERE `range_master`.`isActive` = 1 ";
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

    




    var {
        rangeName,
        rangeEmail,
        ownerName,
        rangeContact,
        rangeTimings,
        rangeDays,
        closeRange,
        noLanes,
        createdBy,
        createdOn,
        modifiedBy,
        digitalLane,
        electronic_beginnerLane,
        Electronic_advancedLane,
        Dry_praticeLane,
       
        isActive

    } = req.body;

    modifiedOn = new Date()

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
                let sql =  "SELECT `userType` FROM `users` WHERE `userEmail` = ? " ;
                let query_profile = db.query(sql, [email], (err, results) => {
                if (err) throw err;
                    
                  if (results.userType == 'admin' || results.range == rangeName){
                    

                    
                var data = {
                    rangeName,
                    rangeEmail,
                    ownerName,
                    rangeContact,
                    rangeTimings,
                    rangeDays,
                    closeRange,
                    noLanes,
                    createdBy,
                    createdOn,
                    modifiedBy,
                    modifiedOn,
                    digitalLane,
                    electronic_beginnerLane,
                    Electronic_advancedLane,
                    Dry_praticeLane,
                    isActive
                    }
        
                     let sql = "UPDATE `range_master` SET ? WHERE `range_master`.`rangeName` = ?";
                        let query_profile = db.query(sql,[data , rangeName], (err, results) => {
                        if (err) throw err;
                        console.log(results);
                        res.json({
                            message: "success",
                        });
    });

                    


                  }
                  else {
                    res.json({message : "you are not allow to change master"})
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