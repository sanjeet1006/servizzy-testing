const jwt=require('jsonwebtoken')
const adminModel=require('../model/Schema/adminSchema')
const authenticate=async(req,res,next)=>{
    try{
        const token=req.cookies.servizzyJwtToken;
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY)
        const rootuser=await adminModel.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!rootuser){
throw new Error("user not found")
        }
        else{
req.token=token
req.user=rootuser
req.userID=rootuser._id
next();
        }
    }catch(err){
        req.flash('success_msg',"Unauthorized:No token provided. First Sign In")
      res.redirect('/')
        // res.status(401).send('Unauthorized:No token provided. First Sign In')
    }

}


module.exports=authenticate;
