const express=require('express');
const router=express.Router();
const wheelServiceModel=require('../model/Schema/TyreServiceModel');
const authenticate=require('../middleware/auhenticate')

router.post('/wheelService',authenticate,async(req,res)=>{
    const {brandName,brandModel,fuelType}=req.body
    try{
        const data=await wheelServiceModel.find({$and:[{
            "carDetails.brandName":brandName},
            {"carDetails.brandModel":brandModel},
            {"carDetails.fuelType":fuelType},
            {"title":"Complete Wheel Care"}
        ]})
res.render('wheelService',{data:data,message:"No Service Available for",brandName,brandModel,fuelType,role:req.user.role})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/wheelService',authenticate,(req,res)=>{
    try{
     res.render('wheelService',{data:'',message:'',brandName:'',brandModel:'',fuelType:'',role:req.user.role})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong"})
    }
    })

router.get('/wheelService/:id',authenticate,async(req,res)=>{
    try{
        const id=req.params.id
        const data=await wheelServiceModel.findById({_id:id})
        res.render('editwheelService',{data:data});
        // res.status(200).json({data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


router.post('/wheelService/edit',authenticate,async(req,res)=>{
try{
const id=req.body.id;
const desc1=req.body.desc1;
const desc2=req.body.desc2;
const time=req.body.time;
const price=req.body.price;
const data=await wheelServiceModel.findByIdAndUpdate(id,{
    warnOne:desc1,
    warnTwo:desc2,
    time:time,
    price:price
})
req.flash('success_msg',"Wheel Service Updated Successfully")
res.redirect('/wheelService')
}catch(err){
    req.flash('error_msg',"Something went wrong")
res.redirect('/wheelService')
// res.status(400).json({messaage:"Something went wrong",err:err.messaage})
}
})


module.exports=router