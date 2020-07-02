const JWT = require('jsonwebtoken')



const Post  = require('../model/post')
const User = require('../model/users')
const Block = require('../model/blocks')

const cloud = require("../cloudinary")
const fs = require("fs")

const multer = require("multer")

const {JWT_SECRET} = require('../configuration/index') 

const passport = require('passport')
const passportconf = require('../passport')


var jwt_Decode = require('jwt-decode');
var url = require('url')


module.exports = {


    blockuser : async function (req ,res){

        var {user_id} = req.body;

        const token = req.headers['authorization'];

        var decoded = jwt_Decode(token);
        _id = decoded.sub.i
        console.log(_id)
        const user = await User.findById(_id)
        console.log(user)


        blockerId = _id;
        blockedId = user_id;

        blockedDate = new Date();

        const check = await Block.findOne({blockedId })
        console.log(check)
        if (!check){

            const block = new Block({
                blockerId : blockerId,
                blockedId : blockedId,
                blockedDate : blockedDate
            })
            block.save().then(results =>{
                res.json({
                    block : results
                })
            }).catch({err  : "wrong"})

        }else {


            if(_id = check.blockerId){
                res.json({
                    message :"this user is already block"
                })
            }else {
                const block = new Block({
                    blockerId : blockerId,
                    blockedId : blockedId,
                    blockedDate : blockedDate
                })
                block.save().then(results =>{
                    res.json({
                        block : results
                    })
                }).catch({err  : "wrong"})

            }

            
        }
    },

    unblockuser : async (req ,res)=>{


        var {user_id} = req.body;

        const token  = req.headers['authorization']
        var decoded = jwt_Decode(token);
        _id = decoded.sub.i
        console.log(_id)
        
        const block = await Block.find({blockerId: _id})

        if(!block){

            res.json({message : "user is already unblock"})

        }else{

            var x = Object.values(block)
           

            console.log(x.length)
           
            for (i =0 ;i<x.length;i++){
               

                if(x[i].blockedId == user_id){

                    deleteId = x[i]._id
                    const deletedblock = await Block.deleteOne({_id :deleteId })

                    if(!deletedblock){
                        res.json(
                            { message : "your is not unblocked" }
                        )
                    }else{
                        res.json(
                            { message : "your is unblocked" }
                        )
                    }
                }
                
            }

            res.json({message : "user is already unblocked"})





        }
        

        



    }


}
