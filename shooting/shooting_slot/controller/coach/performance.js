const db = require("../../database/db");
const { TIMESTAMP } = require("mysql/lib/protocol/constants/types");
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configuration/key");
var jwt_Decode = require("jwt-decode");



module.exports ={


    addRecord : (req,res)=>{


        var { seriesId ,shooterEmail, round ,performanceId} = req.body;
        var currentDate = new Date();
        var time =currentDate.toLocaleTimeString();
        

        const token = req.headers["authorization"];
        var decoded = jwt_Decode(token);
        coachEmail = decoded.sub.e;


        let sqlcoachRange = "SELECT rangeName FROM users WHERE userEmail = ?";
            let query = db.query(sqlcoachRange, [coachEmail], (err, rangeCresults) => {
              if (err) throw err;

              coachRange = rangeCresults[0].rangeName;
              
                let sqlshooterRange =  "SELECT rangeName , userName,isApproved FROM users WHERE userEmail = ?";
                let query = db.query(sqlshooterRange, [shooterEmail], (err, rangeSresults) => {
                    if (err) throw err;
                    
                    if(rangeSresults.length == 0 ){
                        res.json({
                            message : "shooter is not register"
                        })
                    }else{
                    if(rangeSresults[0].isApproved == 0){
                        res.json({
                            message : "this shooter is not approved by admin"
                        })
                    }
                    else{


                        var shooterRange = rangeSresults[0].rangeName;
                        var shooterName = rangeSresults[0].userName;

                        if(shooterRange == coachRange){

                            let sqlrangeName = "SELECT roundName FROM rounds WHERE seriesId = ?";
                            let query = db.query(sqlrangeName, [seriesId], (err, results) => {
                                if (err) throw err;
                                console.log("shiv")
                                console.log(results);

                                console.log(results.length)
                                if (results.length > 9) {

                                    res.json({
                                        message: "all rounds are filled"
                                    })


                                } else {

                                    doneRound = results.length;
                                    let count = 0;
                                    for (var c in round) {
                                        count = count + 1;
                                    }

                                    if (count + doneRound > 10) {

                                        res.json({
                                            message: "you can only fill 10 rounds"
                                        })
                                    } else {

                                        for (i = 1; i <= count; i++) {

                                            roundName = doneRound + i;
                                            data = round[i];
                                            score = data[0];
                                            x = data[1];
                                            y = data[2]
                                            let date = currentDate;
                                            var values = {
                                                seriesId,
                                                roundName,
                                                score,
                                                x,
                                                y,
                                                date,
                                                time
                                            }



                                            let sqlinsertRecord = "INSERT INTO rounds SET ?";
                                            let query = db.query(sqlinsertRecord, values, (err, insertresults) => {
                                                if (err) throw err;
                                                console.log(insertresults);

                                            });





                                        }
                                    }
                                    res.json({
                                        message: "success",
                                    });


                                    let sqlgetdata = "SELECT roundName,score,x,y FROM rounds WHERE seriesId = ?";
                                    let query = db.query(sqlgetdata, [seriesId], (err, roundNameresults) => {
                                        if (err) throw err;
                                        console.log(roundNameresults);

                                        let score = 0;
                                        let x = 0;
                                        let y = 0;

                                        if (roundNameresults.length == 10) {

                                            // user methematics
                                            for (i = 0; i < 10; i++) {

                                                score += roundNameresults[i].score;
                                                x += roundNameresults[i].x;
                                                y += roundNameresults[i].y;


                                            }

                                            let sqlcheckseries = "SELECT seriesName FROM series WHERE  performanceId = ?";
                                            let query = db.query(sqlcheckseries, [performanceId], (err, no_results) => {
                                                if (err) throw err;
                                                console.log(no_results);

                                                doneseries = no_results.length;

                                                if (doneseries == 0) {

                                                    seriesName = 1;
                                                    let date = currentDate;
                                                    var seriesvalues = {
                                                        performanceId,
                                                        seriesId,
                                                        seriesName,
                                                        score,
                                                        x,
                                                        y,
                                                        date,
                                                        time
                                                    }



                                                    let sqlinsertSeries = "INSERT INTO series SET ?";
                                                    let query = db.query(sqlinsertSeries, seriesvalues, (err, insertseriesresults) => {
                                                        if (err) throw err;
                                                        console.log(insertseriesresults);

                                                        //

                                                    });



                                                } else {

                                                    seriesName = doneseries + 1;
                                                    let date = currentDate;
                                                    var seriesvalues = {
                                                        performanceId,
                                                        seriesId,
                                                        seriesName,
                                                        score,
                                                        x,
                                                        y,
                                                        date,
                                                        time
                                                    }



                                                    let sqlinsertSeries = "INSERT INTO series SET ?";
                                                    let query = db.query(sqlinsertSeries, seriesvalues, (err, insertseriesresults) => {
                                                        if (err) throw err;
                                                        console.log(insertseriesresults);

                                                        //

                                                        let sqltotalperformance = "SELECT score ,x,y FROM series WHERE performanceId =?";
                                                        let query = db.query(sqltotalperformance, [performanceId], (err, totalresults) => {
                                                            if (err) throw err;
                                                            console.log(totalresults);

                                                            seriesTotalLenght = totalresults.length;

                                                            var scores = 0
                                                            var X = 0
                                                            var Y = 0
                                                            for (i = 0; i < seriesTotalLenght; i++) {

                                                                scores = scores + totalresults[i].score;
                                                                X = scores + totalresults[i].x;
                                                                Y = scores + totalresults[i].y;

                                                            }

                                                            let sqlperformance = "SELECT * FROM performance WHERE performanceId = ?";
                                                            let query = db.query(sqlperformance, [performanceId], (err, perresults) => {
                                                                if (err) throw err;
                                                                console.log(perresults);

                                                                if (perresults.length == 0) {
                                                                    let date = currentDate;
                                                                    var performanceData = {
                                                                        performanceId,
                                                                        shooterEmail,
                                                                        shooterName,
                                                                        scores,
                                                                        X,
                                                                        Y,
                                                                        date,
                                                                        time

                                                                    }

                                                                    let sqlinsertperformance = "INSERT INTO performance SET ?";
                                                                    let query = db.query(sqlinsertperformance, performanceData, (err, newresults) => {
                                                                        if (err) throw err;
                                                                        console.log(newresults);


                                                                    });




                                                                } else {

                                                                    let sqlupdateperformance = "UPDATE performance SET scores = ? , X= ? ,Y = ? WHERE performanceId = ?";
                                                                    let query = db.query(sqlupdateperformance, [scores, X, Y, performanceId], (err, updateresults) => {
                                                                        if (err) throw err;
                                                                        console.log(updateresults);



                                                                    });
                                                                }
                                                            });
                                                        });
                                                    });
                                                }
                                            });

                                        }
                                    });
                                }
                            });
                        }else {

                            res.json({
                                message : "you are authorized for the shooter"
                            })
                        }
                    }
                }
            });
            });


    },



}