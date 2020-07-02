const mongoose = require('mongoose')
const { model } = require('./users')

const {objectId} = mongoose.Schema.Types

const blockSchema =  mongoose.Schema({ 
    
   blockerId :{
       type : String,
            required: true
   },
   blockedId :{
       type : String,
            required: true
   },
   blockedDate :{
       type : Date,
            required : true
   }
  



});

blockSchema.paginate = function(pageNo, callback){

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



const block  = mongoose.model('blocks' , blockSchema);

module.exports = block;