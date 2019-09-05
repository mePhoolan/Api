var mongoose=require("mongoose");

require('dotenv').config()
var url=process.env.MONGODB_URL
mongoose.connect(url,{useNewUrlParser:true,useCreateIndex: true,useFindAndModify: false},function(err,database){
    
       if(err){
           console.log("database is not connected")
       }
       else{
           console.log("database is connected")
       }

    })
  require('./model/user.js');