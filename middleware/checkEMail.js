const adminModel=require('../model/Schema/adminSchema')
const checkEmail=async(req,res,next)=>{
    try{
        const email=req.body.email;
        const checkExistEmail=await adminModel.findOne({email:email});
        if(checkExistEmail){
            req.flash('error_msg','Email Id already exist')
            return res.redirect('/addAdmin')
            // return res.status(409).json({message:"Email Id already exist"});
        }
        next();
    }catch(err){
res.status(400).json({error:err})
    }
   
}
module.exports=checkEmail;