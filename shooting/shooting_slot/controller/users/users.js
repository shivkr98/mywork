const db = require("../../database/db");
var passwordHash = require("password-hash");
var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");
const { JWT_SECRET } = require("../../configuration/key");
var jwt_Decode = require("jwt-decode");

signToken = (user) => {
  return JWT.sign(
    {
      iss: "shooting",
      sub: {
        i: user.userId,
        e: user.userEmail,
      },
      iat: new Date().getTime(), // current date
      exp: new Date().setTime(new Date().getTime() * 1), // current time +1 day ahead
    },
    JWT_SECRET
  );
};

module.exports = {
  register: async (req, res) => {
    var {userName , userEmail ,userPassword, userMobnum , userType, rangeName } = req.body;

    createdOn = new Date();
    updateAt = new Date();
    isActive  = 1;
    isApproved = 0;

    var hashedPassword = passwordHash.generate(userPassword);

    userPassword = hashedPassword;
    let data = {userName , userEmail ,userPassword,userMobnum , userType  , createdOn , updateAt , isActive , isApproved,rangeName}

    db.query("SELECT * FROM users WHERE userEmail = ?", [userEmail], function (
      error,
      results
    ) {
      console.log(results);
      if (results.length>0) {
        res.json({
          message: "email already exist",
        });
      } else {

        //check range is our list or not
        let sqlcheckRange = "SELECT * FROM range_master WHERE rangeName = ?";
        let query = db.query(sqlcheckRange, [rangeName], (err, checkresults) => {
          if (err) throw err;
          console.log(checkresults);

          if(checkresults.length ==0){

            res.json({
              message : "this range is not valid"
            })
          }else {

            let sqlRegister = "INSERT INTO users SET ?";
            let query = db.query(sqlRegister, data, (err, results) => {
              if (err) throw err;
              console.log(results);
              res.json({
                message: "success",
              });
            });


          }
         




        });



        
      }
    });
  },

  login: async function (req, res) {
    var userEmail = req.body.userEmail;
    var password = req.body.userPassword;

    db.query("SELECT * FROM users WHERE userEmail = ?", [userEmail], async function (
      error,
      results
    ) {
      if (error) {
        res.json({
          message: error,
        });
      } else {
        if (results.length > 0) {
          const m = passwordHash.verify(password, results[0].userPassword);

          // if not handel it
          if (!m) {
            return res.json({ message: "password not match" });
          } else {
            console.log("dfd")
            console.log(results[0])
            const token = signToken(results[0]);
            console.log("me pagal")

            res.json({
              message: "login successfully ",
              jwttoken: token,
              Name : results[0].userName,
              email: userEmail,
              userType: results[0].userType
            });
          }
        } else {
          res.json({
            message: "Email does not exits",
          });
        }
      }
    });
  },

  token: async function (req, res) {
    const token = req.headers["authorization"];
    // console.log(token);
    var decoded = jwt_Decode(token);
    // verify token pending
    email = decoded.sub.e;
    // console.log(email);

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
           res.json({
             message: "verified",
           });
          // next();
        }
      });
      console.log(token)
    }
    // else {
    //   // send not found error
    //   //res.send(401, " ");
    //   res.status(401).send("Invalid Access");
    // }

    // db.query("SELECT * FROM users WHERE email = ?", [email], async function (
    //   error,
    //   results
    // ) {
    //   if (error) {
    //     res.json({
    //       message: error,
    //     });
    //   } else {
    //     if (results) {
    //       console.log(results[0]);
    //       res.json({ message: "you are  authorizaed " });
    //     } else {
    //       res.json({ message: "you are not authorizaed" });
    //     }
    //   }
    // });
  },



};
