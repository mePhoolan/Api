var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
   // userId: { type: String },
   username:{
       index:true,
       type:String,      
    },
     email:{
     type:String
    },
    password:{
       type:String
    },
     mobileNo:{
        type:Number
     },
     graduation:{
        type:String
     },
     job:{
     type:String
     },
    image:[{
       type:Buffer,   
   //  contentType: String  
    }],
    uploadDate: {type: Date, default: Date.now}
   },{timestamps:true})

var User=mongoose.model('user', UserSchema) 
// User.createIndexes({"username":"text"})

module.exports=User;



