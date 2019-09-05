 require('./mongodb.js')
require('dotenv').config()
const express=require("express")
const app=express()

var bodyParser = require('body-parser');
var jwt=require('jsonwebtoken');
var localStorage=require('localStorage')
var bcrypt=require('bcrypt');
var config = require('./Auth/config');
const verifyToken=require('./Auth/auth')
const mongoose=require('mongoose')
// const tokenList = {}
const sharp=require('sharp')

const port=process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Address=require("./model/address.js")
const User=require("./model/user.js")
const {sendWelcomeEmail,sendCancelEmail}=require('./Auth/acount.js')
// upoad a file in mongodb
const multer=require('multer');


app.get("/",(req,res)=>{
    res.send("hello my first get api")
})

       app.post('/signup',function(req,res){
          console.log(req.body.password)
      
            const user=new User({
            // userId=mongoose.Types.ObjectId(userId),
            username:req.body.username,
            email:req.body.email,
            password:hash,
            mobileNo:req.body.mobileNo,
            graduation:req.body.graduation,
            job:req.body.job,  
            // image:req.file.buffer

       }) 
          var hash=bcrypt.hash(req.body.password,10,function(err,hash){
            console.log(hash)
           if(err){
               res.send("something is wrong")
           } 
           User.findOne({ email: req.body.email }, function(err, email) {
            if(err) {
               res.send("issue")
            }
           if(email){
            res.send("user  is already exist")
         } 
          else{
            user.password=hash  
           user.save(function(err,data){
             sendWelcomeEmail(user.email,user.username)
            if(err){
                res.status(500).send({
                    code:501,
                    eror:err,
                    msg:"data is not saved"
                })
            
            }else{
                console.log(data);

              res.status(200).send({
                  status:true,
                  code:200,
                  msg:"data is saved successfully",
                  data:data
              })
            
        
    }    
                           
        })
    }
    })
    
 })
 })

  //  file upload
  const upload=multer({
  // dest:'./public/images',
  limit:{
     fileSize:1000000
     },
     fileFilter(req,file,cb){
     if(!file.originalname.match(/\.(doc|docx|jpeg|png|jpg|gif|pdf)$/)){
      return cb(new Error('please upload a file'))
    }
    cb(undefined,true)
  }

})
  app.post('/upload',verifyToken,upload.single('image'),async (req,res,next)=>{
   console.log(req.file)
  
  //  req.user=new User
   const buffer= await sharp(req.file.buffer).resize({width:100,height:100}).png().toBuffer()
   req.user.image=buffer;
   user=req.user;
  //  req.user.contentType='image/jpg'
  
   await User.updateOne({email:user.email},{ $push: {image:buffer}})
  
   res.status(200).send({data :req.user}) }, (error, req, res, next) => {
   
  res.status(400).send({ error: error.message })
})

//get image in browser

app.get('/image/:userId',(req,res,next)=>{
  console.log(req.params.userId)
  // req.user.image=[]
  User.findById({_id:mongoose.Types.ObjectId(req.params.userId)},{image:1},)
  .then(user => {
      if(!user||!user.image) {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
            
          });            
      }
      res.set('Content-Type','image/png')
      return res.send(user.image[9]);
      // console.log(user.image)
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });                
      }
      return res.status(500).send({
          message: "Error retrieving note with id " + req.params.userId
      });
  });

})



// populate with address


app.post('/address',function(req,res){
const address=new Address({
      userId:req.body.userId,
    address:[{
        houseNo:req.body.houseNo,
        streetNo:req.body.streetNo,
        pincode:req.body.pincode,
        city:req.body.city,
        //  userId:req.body.userId,
    }]

     }) 
     
        address.save(function(err,data){
            if (err) {
                throw err;
            }
            res.send(data)
        })

    })
    

    app.get('/details',function(req, res){
    console.log("this is your mail",req.body.email);
         const email=req.body.email
        User.findOne({email:email}, function(err, data) {
          if (err) {
            console.log(err);
            return res.status(401).send('Something Went wrong with Retrieving data');
          } else {
            // console.
            res.json(data);
          }
        });
      
      });
 
   

      app.get('/userdetails', function(req, res) {
         const city=req.body.city
      Address.findOne({city:city}).populate('userId').exec((err, data)=>{
          if (err) {
            console.log(err);
            return res.send(500, 'Something Went wrong with Retrieving data');
          } else {
            // console.log(data[0]);
            res.json({
                msg:"Populated Data",
                Userdata:data
            });
          }
        })
      
      });

      //  delete a particular field
  app.delete('/delete',verifyToken,(req,res,next)=>{
    console.log(req.user)
      //  const email=user.email
            user=req.user
           if(user.email===req.body.email){
            User.updateOne({email:req.body.email},{$unset: { image: "",} },function(err,user){
              console.log("this is user",user)
              if(err){
                  res.send("something went wrong")
              }
                else{
                res.status(200).send({
                  err:false,
                  msg:" image is deleted successfully",
                  user:user})
              }

            })
          
          }
          else{
            res.status(401).send("user is not match")

          }
  })
         
    // delete a user account
    app.delete('/deleteAccount',verifyToken,async (req,res)=>{
      console.log(req.user)
          user=req.user
          email=user.email;
          username=req.body.username
     try {
        await User.findOneAndDelete({email:user.email})
             sendCancelEmail(user.email,username)
            res.status(200).send({
                 err:false,
                 msg:"user is deleted successfully",
                 user:user
                 })      
     }
     catch (e){
       res.status(401).send({
        err:true, 
        msg:"user is not deleted",
        status:false})

     }
          
    })
    //login system
  app.get('/login',function(req,res,next){
    User.findOne({email: req.body.email})
    .exec()
    .then(function(user) {
       bcrypt.compare(req.body.password, user.password, function(err, result){
                  if(err) {
             return res.status(401).json({
                failed: 'unauthorized access'
             });
          }
         if(result) {
            const token = jwt.sign({
                email: user.email,
                password: user.password}, process.env.JWT_SECRET, { expiresIn:config.expiredIn});
                const response={
                  "token":token,
                  user:user,
                  status:result
                }
                 res.status(200).json({
                 success: 'Welcome to the JWT Auth',
                 response:response
               });
             next()
          } 
          // localStorage.setItem('token',user.token)
          // localStorage.removeItem('token')
          return res.status(401).json({
             failed: 'Unauthorized Access'
          });
       });
    })
    .catch(() => {
       res.status(500).json({
          error: 'user is not found in database'
       });
    });;
 });
  

 
app.get('/data', verifyToken, async (req, res) => {
  console.log(req.user)
  res.send({
    user:req.user})
})


  //  pagination in mongodb
  // localhost:3000/paginate?pageNo=1&size=2

       app.get('/paginate',function(req,res){

        var pageNo=parseInt(req.query.pageNo)
        var size=parseInt(req.query.size)
         var query={}

         if(pageNo  < 0 || pageNo === 0){
           response={
             "err": true,
             message:"Invalid page No,should start with 1"};
             return res.json(response)
         }

         query.skip=size*(pageNo-1)
         query.limit=size

        User.countDocuments({},function(err,totalCount){
           if(err){
            response={ err:true,
             msg:"Error fetching data"
           }
          }
        
       User.find({},{},query,function(err,data){

        if(err){
          response={
            err:true,
            msg:"Error fetching data"
          }
        }
        else{
           
          var totalPages=Math.ceil(totalCount/size)

          response={
            err:false,
            msg:data,
            pages:totalPages
          };
        }
      
        res.json(response)

       })
          })
           })



//  searching in nodejs 
app.get('/search',function(req,res){
   console.log(req.query.q)
   var q=req.query.q
    User.find({
     $text:{
     $search:q}},{ score: { $meta: "textScore" } },{
     id:0,v:0},function(err,response){
     if(err){
    res.status(401).send({
     err:true,
     msg:"no data found"
    })
    }else{
      console.log("here is your search",response)
    res.json(response)
    }
     })

    //  User.find({storeData:{$regex:new RegExp(q)}},
   
    // function(err,data){
    //   console.log(data)
    //         if(err){
    //           res.status(401).send({
    //             err:true,
    //             msg:"data is mismatch"
    //           })
    //         }
    //         else{
    //           res.status(400).send({
    //             err:false,
    //             data:data})
    //         } })
})

//hot to upload a file in mongodb

    // logout user
  app.get('/logout',(req,res)=>{

  })

       
   



app.use(User)
app.use(Address)
// app.use(Auth)
app.listen(port,()=>{

  console.log("server is running on",+port);

});

