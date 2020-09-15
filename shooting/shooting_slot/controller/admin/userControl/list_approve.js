const db = require("../../../database/db");


var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../../../configuration/key");
var jwt_Decode = require("jwt-decode");
const { json } = require('body-parser');



module.exports = {

    list_approved  : (req , res) =>{

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
                
                let sqladmin = "SELECT * FROM users WHERE userEmail = ?";
                let queryAdmin = db.query(sqladmin, [email], (err, results) => {
                if (err) throw err;
                console.log(results);
                range = results[0].rangeName

                if (results[0].userType == 0 ){

                    let sqlapproved_list =  "SELECT userEmail FROM users WHERE isApproved = 1 AND userType = 1 AND rangeName = ?";
                    let queryapproved_list = db.query(sqlapproved_list, range, (err, results_list) => {
                    if (err) throw err;
                    console.log(results_list);
          
                    res.json({result : results_list})
                    });


                }else{
                    res.json({message : "you are not admin you are not authorized to show this list"})
                }
                
                });
          
        }
      });
      console.log(token)
    }else {
        res.json(
                { message : "you are not authorized" }
            )
    }



    },


    list_nonaproved : (req, res)=>{

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
                
                let sqladmin = "SELECT * FROM users WHERE userEmail = ?";
                let queryAdmin = db.query(sqladmin, [email], (err, results) => {
                if (err) throw err;
                console.log(results);
                range = results[0].rangeName

                if (results[0].userType == 0){

                    let sqlapproved_list = "SELECT userEmail FROM users WHERE isApproved = 0 AND userType = 1 AND rangeName = ?";
                    let queryapproved_list = db.query(sqlapproved_list, [range], (err, results_list) => {
                    if (err) throw err;
                    console.log(results_list);
          
                    res.json({result : results_list})
                    });


                }else{
                    res.json({message : "you are not admin you are not authorized to show this list"})
                }
                
                });
          
        }
      });
      console.log(token)
    }else {
        res.json(
                { message : "you are not authorized" }
            )
    }


       
        

    }


}