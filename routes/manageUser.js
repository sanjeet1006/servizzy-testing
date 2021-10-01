const express=require('express');
const router=express.Router();
const userModel=require('../model/Schema/userModel');
const authenticate=require('../middleware/auhenticate')
router.get('/user',authenticate,async(req,res)=>{
try{
    const userData=await userModel.find();
     res.render('user',{data:userData,role:req.user.role})
    // res.status(200).json({message:"All user retrieved",data:userData});
}catch(err){
    res.status(400).json({message:"Something went wrong",err:err.message})
}
})

router.get('/user/delete/:id',authenticate,async(req,res,next)=>{
    try{
        const id=req.params.id
        const data=await userModel.findByIdAndDelete({_id:id})
        req.flash('success_msg',"User deleted Successfully")
        res.redirect('/user')
    }catch(err){
        req.flash('error_msg',"Something went Wrong")
        res.redirect('/user')
        // res.status(400).json({message:"Something went Wrong",err:err})
    }
})
module.exports=router;