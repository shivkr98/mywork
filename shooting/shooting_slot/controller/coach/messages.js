const db = require("../../database/db");
const { TIMESTAMP } = require("mysql/lib/protocol/constants/types");
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configuration/key");
var jwt_Decode = require("jwt-decode");


module.exports ={

    sendMessage : async (req,res)=>{

        var { toEmail , message} = req.body;

        const token = req.headers["authorization"];
        var decoded = jwt_Decode(token);
        coachEmail = decoded.sub.e;

        let toRange ="SELECT `rangeName`,`userName` FROM `users`  WHERE `userEmail` = ?  ";
          db.query(toRange, [toEmail], (err, rangeTRresults) => {
            if (err) throw err;

            if (rangeTRresults.length > 0) {
              
                 var toName = rangeTRresults[0].userName;
                var toRange = rangeTRresults[0].rangeName;

              let coachRange =
                "SELECT `rangeName`,`userName` FROM `users` WHERE `userEmail` = ? ";
              db.query(coachRange, [coachEmail], (err, rangeSRresults) => {
                if (err) throw err;

                if (rangeSRresults.length > 0) {
                  coachRange = rangeSRresults[0].rangeName;
                  let coachName = rangeSRresults[0].userName;

                  if (toRange == coachRange) {
                    rangeName = toRange;
                    fromEmail = coachEmail;
                    var receverName = toName;
                    var senderName = coachName;
                    var currentDate = new Date();
                    var time =currentDate.toLocaleTimeString();
                                    

                    var sendData = {
                      rangeName,
                      toEmail,
                      fromEmail,
                      message,
                      time,
                      currentDate,
                      receverName,
                      senderName,
                    };

                    let sqlRecord = "INSERT INTO `message` SET ? ";
                    db.query(sqlRecord, sendData, (err, markRresults) => {
                      if (err) throw err;
                      console.log(markRresults);
                      res.json({
                        message: "Message Sent",
                      });
                    });
                  }
                } 
              });
            }else {
                res.json({ 
                  message: "no profile exist" 
                });
              }
            
          });



    },

    showMessage : async (req,res)=>{

        var { toEmail } = req.body;

        const token = req.headers["authorization"];
        var decoded = jwt_Decode(token);
        coachEmail = decoded.sub.e;

        let toRange ="SELECT `rangeName`,`userName` FROM `users`  WHERE `userEmail` = ?  ";
          db.query(toRange, [toEmail], (err, rangeTRresults) => {
            if (err) throw err;

            if (rangeTRresults.length > 0) {
              
                
                var toRange = rangeTRresults[0].rangeName;

              let coachRange =
                "SELECT `rangeName`,`userName` FROM `users` WHERE `userEmail` = ? ";
              db.query(coachRange, [coachEmail], (err, rangeSRresults) => {
                if (err) throw err;

                if (rangeSRresults.length > 0) {
                  coachRange = rangeSRresults[0].rangeName;
                  

                  if (toRange == coachRange) {


                    let sqlshowfrommessage = "SELECT * FROM message WHERE rangeName = ? AND fromEmail = ? AND toEmail = ? ";
                    let query = db.query(sqlshowfrommessage, [toRange , coachEmail,toEmail], (err, coachmessageresults) => {
                      if (err) throw err;
                      console.log( coachmessageresults);
                      

                      let sqlshowtomessage = "SELECT * FROM message WHERE rangeName = ? AND fromEmail = ? AND toEmail = ? ";
                      let query = db.query(sqlshowtomessage,[toRange , toEmail , coachEmail], (err, tomessageresults) => {
                        if (err) throw err;
                        console.log(tomessageresults);
                        res.json({
                          message: coachmessageresults,
                          tomessage: tomessageresults
                        });
                      });

                      



                    });
                    








                  }
                } 
              });
            }else {
                res.json({ 
                  message: "no profile exist" 
                });
              }
            
          });




    }





}