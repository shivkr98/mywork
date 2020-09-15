const express = require ('express');
const router = express.Router();
const db = require("../database/db");
const masterGender = require('../controller/master/genderMaster')
const masterOrgan = require('../controller/master/organizationMaster');
const masterOccupation = require('../controller/master/occupationMaster');
const masterNationality = require('../controller/master/nationalityMaster');
const masterUserType = require('../controller/master/userTypeMaster');

const masterCity = require('../controller/master/cityMaster')
const masterState = require('../controller/master/stateMaster')
const masterRole = require('../controller/master/roleMaster')
const masterProfile = require('../controller/master/profileTypeMaster')


var jwt = require("jsonwebtoken");

const JWT = require("jsonwebtoken");

const { JWT_SECRET } = require("../configuration/key");
var jwt_Decode = require("jwt-decode");
const { json } = require('body-parser');




function check(req , res,next)  {


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
                    
                  if (results.userType == 0){
                    next();
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


router.route("/addgender")
.post(check , masterGender.add)

router.route("/show")
.get(check,masterGender.show)

router.route("/update")
.post(check,masterGender.update)

router.route("/delete")
.post(check,masterGender.delete)




//city_master
router.route("/addcity")
.post(check,masterCity.add)

router.route("/show1")
.get(check,masterCity.show)

router.route("/update1")
.post(check,masterCity.update)

router.route("/delete1")
.post(check,masterCity.delete)


//state_master
router.route("/addstate")
.post(check,masterState.add)

router.route("/show2")
.get(check,masterState.show)

router.route("/update2")
.post(check,masterState.update)

router.route("/delete2")
.post(check,masterState.delete)


//role_master
router.route("/addrole")
.post(check,masterRole.add)

router.route("/show3")
.get(check,masterRole.show)

router.route("/update3")
.post(check,masterRole.update)

router.route("/delete3")
.post(check,masterRole.delete)


//profileType_master
router.route("/addprofile")
.post(check,masterProfile.add)

router.route("/show3")
.get(check,masterProfile.show)

router.route("/update3")
.post(check,masterProfile.update)

router.route("/delete3")
.post(check,masterProfile.delete)


//Organization_Master
router.route("/addOrganization")
.post(check,masterOrgan.addOrganization)

router.route("/showOrganization")
.get(check,masterOrgan.showOrganization)

router.route("/updateOrganization")
.post(check,masterOrgan.updateOrganization)

router.route("/deleteOrganization")
.post(check,masterOrgan.deleteOrganization)


//Occupation_Master
router.route("/addOccupation")
.post(check,masterOccupation.addOccupation)

router.route("/showOccupation")
.get(check,masterOccupation.showOccupation)

router.route("/updateOccupation")
.post(check,masterOccupation.updateOccupation)

router.route("/deleteOccupation")
.post(check,masterOccupation.deleteOccupation)

//Nationality_Master
router.route("/addNationality")
.post(check,masterNationality.addNationality)

router.route("/showNationality")
.get(check,masterNationality.showNationality)

router.route("/updateNationality")
.post(check,masterNationality.updateNationality)

router.route("/deleteNationality")
.post(check,masterNationality.deleteNationality)

//UserType_master
router.route("/addUserType")
.post(check,masterUserType.addUserType)

router.route("/showUserType")
.get(check,masterUserType.showUserType)

router.route("/updateUserType")
.post(check,masterUserType.updateUserType)

router.route("/deleteUserType")
.post(check,masterUserType.deleteUserType)

module.exports = router
