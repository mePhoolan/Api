var mongoose = require('mongoose');

var AddressSchema = new mongoose.Schema({
   
   userId:[{ 
      type:mongoose.Schema.Types.ObjectId,
       ref:'user',
   }],
     address:[{
          houseNo:{
       type:Number,
    },
     streetNo:{
     type:Number,
    },
    pincode:{
       type:Number,
    },
      city:{
          type:String
      },

     }]

    })
 
//   upvotes: {type: Number, default: 0},
//   comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]


var Address=mongoose.model('address', AddressSchema)
module.exports=Address;