const express=require('express');
const router=express.Router();
const WindSheildModel=require('../model/Schema/WindSheildModel');
const authenticate=require('../middleware/auhenticate')

router.post('/windshieldService',authenticate,async(req,res)=>{
    const {brandName,brandModel,fuelType}=req.body
    try{
        const data=await WindSheildModel.find({$and:[{
            "carDetails.brandName":brandName},
            {"carDetails.brandModel":brandModel},
            {"carDetails.fuelType":fuelType},
            {"title":{
                $in:["Door Glass Change" ,
                "Front Windshield Change",
                "Rear Windshield Change"]
            }}
        ]})
res.render('windShieldService',{data:data,message:"No Service Available for",brandName,brandModel,fuelType,role:req.user.role})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/windshieldService',authenticate,(req,res)=>{
    try{
     res.render('windShieldService',{data:'',message:'',brandName:'',brandModel:'',fuelType:'',role:req.user.role})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong"})
    }
    })

router.get('/windshieldService/:id',authenticate,async(req,res)=>{
    try{
        const id=req.params.id
        const data=await WindSheildModel.findById({_id:id})
        res.render('editwindShieldService',{data:data});
        // res.status(200).json({data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


router.post('/windshieldService/edit',authenticate,async(req,res)=>{
try{
const id=req.body.id;
const desc1=req.body.desc1;
const desc2=req.body.desc2;
const time=req.body.time;
const price=req.body.price;
const data=await WindSheildModel.findByIdAndUpdate(id,{
    warnOne:desc1,
    warnTwo:desc2,
    time:time,
    price:price
})
req.flash('success_msg','Windshield Services Updated Successfully')
res.redirect('/windshieldService')
}catch(err){
req.flash('error_msg','Something went wrong')
res.redirect('/windshieldService')
// res.status(400).json({messaage:"Something went wrong",err:err.messaage})
}
})


module.exports=router