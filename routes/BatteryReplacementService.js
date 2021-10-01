const express=require('express');
const router=express.Router();
const batteryServiceModel=require('../model/Schema/BatteryServiceModel');
const authenticate=require('../middleware/auhenticate')
router.post('/batteryService',authenticate,async(req,res)=>{
    const {brandName,brandModel,fuelType}=req.body
    try{
        const data=await batteryServiceModel.find({$and:[
            {"carDetails.brandName":brandName},
            {"carDetails.brandModel":brandModel},
            {"carDetails.fuelType":fuelType},
            {"title":{
                $in:[
                    "Amaron(55 Months Warranty)",
                    "Exide(55 Months Warranty)",
                    "Livguard(60 Months Warranty)"
                ]
            }}
        ]})
res.render('batteryReplacementService',{data:data,message:"No Service Available for",brandName,brandModel,fuelType,role:req.user.role})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/batteryService',authenticate,(req,res)=>{
    try{
     res.render('batteryReplacementService',{data:'',message:'',brandName:'',brandModel:'',fuelType:'',role:req.user.role})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong"})
    }
    })

router.get('/batteryServices/:id',authenticate,async(req,res)=>{
    try{
        const id=req.params.id
        const data=await batteryServiceModel.findById({_id:id})
        res.render('editbatteryReplacementService',{data:data,role:req.user.role});
        // res.status(200).json({data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


router.post('/batteryServices/edit',authenticate,async(req,res)=>{
try{
const id=req.body.id;
const desc1=req.body.desc1;
const desc2=req.body.desc2;
const time=req.body.time;
const price=req.body.price;
const data=await batteryServiceModel.findByIdAndUpdate({_id:id},{
    warnOne:desc1,
    warnTwo:desc2,
    time:time,
    price:price
})
req.flash('success_msg','Battery Replacement Services Updated Successfully')
res.redirect('/batteryService')
}catch(err){
    req.flash('error_msg','Something went wrong')
    res.redirect('/batteryService')
// res.status(400).json({messaage:"Something went wrong",err:err.messaage})
}
})


module.exports=router