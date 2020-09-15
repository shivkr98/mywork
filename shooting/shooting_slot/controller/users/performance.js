const db = require("../../database/db");
const { TIMESTAMP } = require("mysql/lib/protocol/constants/types");
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configuration/key");
var jwt_Decode = require("jwt-decode");



module.exports ={


    showPerformance : (req,res)=>{

        var {date} = req.body;
        
        const token = req.headers["authorization"];
        var decoded = jwt_Decode(token);
        shooterEmail = decoded.sub.e;

        let sqlgetperformance = "SELECT * FROM performance WHERE shooterEmail = ? AND date =?";
        let query = db.query(sqlgetperformance, [shooterEmail,date], (err, performanceresults) => {
            if (err) throw err;
            console.log(performanceresults);
            
            if(performanceresults.length == 0){

                res.json({
                    message : `you do not have any round at ${date}`
                })
            }else{

                performanceID=performanceresults[0].performanceId



                let sqlgetseries = "SELECT * FROM series WHERE performanceId =?";
                let query = db.query(sqlgetseries, [performanceID], (err, seriesresults) => {
                    if (err) throw err;
                    
                    if(seriesresults.length == 0){
                        res.json({
                            message : "something is wrong please check "
                        })
                    }else{

                       //

                       res.json({
                        performance_data : performanceresults,
                        series_data : seriesresults
                    })



                    }

                });

                //









               
            }



        });

    },

    showRound  : (req,res)=>{

        var { seriesId ,performanceId} = req.body;

        
        const token = req.headers["authorization"];
        var decoded = jwt_Decode(token);
        shooterEmail = decoded.sub.e;

        let sqlperformanceData = "SELECT shooterEmail FROM performance WHERE performanceId = ?";
        let query = db.query(sqlperformanceData, [performanceId], (err, performresults) => {
            if (err) throw err;
            console.log(performresults);

            if(performresults.length == 0){
                res.json({
                    message : "profomance id not valid"
                })
            }else{


                if(performresults[0].shooterEmail != shooterEmail){

                    res.json({
                        messsage : "this serires not belong to this performance"
                    })
                }else{


            let sqlSeries = "SELECT seriesId FROM series WHERE performanceId = ? AND seriesId =?";
            let query = db.query(sqlSeries, [performanceId , seriesId ], (err, seriesresults) => {
              if (err) throw err;
              console.log(seriesresults);
              
              if(seriesresults.length == 0){
                  res.json({
                      message : "series id is wrong"
                  })
              }else{


                  let sqlRound = "SELECT * FROM rounds WHERE seriesId = ?";
                  let query = db.query(sqlRound, [seriesId], (err, roundresults) => {
                      if (err) throw err;
                      console.log(roundresults);

                      if(roundresults.length == 0){

                        res.json({
                            message : "something is wrong please do it again"
                        })
                      }else{


                        res.json({
                            rounds : roundresults
                        })
                      }
                     




                  });





              }

            

            });
            
        }


        }

        });






    }


}