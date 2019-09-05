 User.aggregate([{
    $match:{_id:mongoose.Types.ObjectId(req.params.userId)}
},
 {
    $project: { 
      image:1,
         totalImage: { $size: "$image" } }
      }
   
] ).exec(function(err,user){
  if(err) {
    console.log(err)
    return
  }
  if(!user) {
             return res.status(404).send({
             message: "User not found with id " + req.params.userId
              
          });            
        }
  else{
    res.set('Content-Type','image/png')
       res.send(user)
       console.log(user)
  }
})
