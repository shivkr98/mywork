const mongoose = require('mongoose')
const { model } = require('./users')

const {objectId} = mongoose.Schema.Types

const postSchema =  mongoose.Schema({ 
    
    title: { 
        type : String,
            required: true
     },

     body: { 
         type : String,
            required: true
         },

     photo: { 
         type: String,
            default : "no photo"
         },
        
     postedBy : {
         type : String,
            required: true
     },
     isActive : {
         type: Boolean,
            default : true
     },
     
     comments : [{
         text : String,
         postedBy : String
     }],
     likes :{
         type : Number,
         default : 0
     },
     createdAt :{
         type : String,
         required: true
     }





});

postSchema.paginate = function(pageNo, callback){

    var limit = 10;
    var skip = pageNo * (limit - 1);
    var totalCount;

    //count documents
    this.count({}, function(err, count){ 
        if(err){
            totalCount = 0;
        }
        else{
            totalCount = count;
        }
    })
    if(totalCount == 0){
        return callback('No Document in Database..', null);
    }
    //get paginated documents
    this.find().skip(skip).limit(limit).exec(function(err, docs){

        if(err){
            return callback('Error Occured', null);
        }
        else if(!docs){
            return callback('Docs Not Found', null);
        }
        else{
            var result = {
                "totalRecords" : totalCount,
                "page": pageNo,
                "nextPage": pageNo + 1,
                "result": docs
            };
            return callback(null, result);
        }

    });

};



const post  = mongoose.model('post' , postSchema);

module.exports = post;