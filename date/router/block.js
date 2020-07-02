const express = require('express')
const router = express.Router()
const passport = require('passport')
const passportconf = require('../passport')




const BlockController = require('../controller/block')



router.route('/blockuser')
    .post(passport.authenticate('jwt' , { session: false}),BlockController.blockuser)

    
router.route('/unblockuser')
.post(passport.authenticate('jwt' , { session: false}),BlockController.unblockuser)

   



module.exports = router;    