const jwt=require('jsonwebtoken');
const config=require('./config')

module.exports = (req,res,next) => {
  console.log("this is my token",req.headers['authorization']);
  const token =  req.headers['authorization'].split(' ')[1]
  // decode tokenif (token) {// verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
        if (err) {
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.user = user
       next();
      });
  }