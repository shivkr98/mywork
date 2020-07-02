const express = require('express')
const router = express.Router()
const passport = require('passport')
const passportconf = require('../passport')

const multerConfig = require("../configuration/multer")


const PostController = require('../controller/post')



router.route('/createPost')
    .post(passport.authenticate('jwt' , { session: false}),multerConfig,PostController.createPost)

   
router.route('/myPost')
    .post(passport.authenticate('jwt' , { session: false}),PostController.myposts) 

router.route('/deletePost')
    .post(passport.authenticate('jwt' , { session: false}),PostController.deletePost)
    
router.route('/commentPost')
    .post(passport.authenticate('jwt' , { session: false}),PostController.commentPost)  
    
router.route('/likePost')
    .post(passport.authenticate('jwt' , { session: false}),PostController.likePost)  
      
router.route('/showPost')
.post(passport.authenticate('jwt' , { session: false}),PostController.showPost)

router.route('/showallPost')
.post(passport.authenticate('jwt' , { session: false}),PostController.showAllpost) 


module.exports = router;    