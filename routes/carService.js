const express=require('express');
const authenticate = require('../middleware/auhenticate');
const router=express.Router();
const CarServicePackModel=require('../model/Schema/ServicePackModel');

router.post('/carService',authenticate,async(req,res)=>{
    const {brandName,brandModel,fuelType}=req.body
    try{
        const data=await CarServicePackModel.find({$and:[{
            "carDetails.brandName":brandName},
            {"carDetails.brandModel":brandModel},
            {"carDetails.fuelType":fuelType},
            {title:{$in:[
                "Prime Service",
                "Standard Service"
            ]}}
        ]})
res.render('carService',{data:data,message:"No Service Available for",brandName,brandModel,fuelType,role:req.user.role})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/carService',authenticate,(req,res)=>{
    try{
     res.render('carService',{data:'',message:'',brandName:'',brandModel:'',fuelType:'',role:req.user.role})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong"})
    }
    })

router.get('/carService/:id',authenticate,async(req,res)=>{
    try{
        const id=req.params.id
        const data=await CarServicePackModel.findById({_id:id})
        res.render('editcarService',{data:data,role:req.user.role});
        // res.status(200).json({data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


router.post('/carService/edit',authenticate,async(req,res)=>{
try{
const id=req.body.id;
const desc1=req.body.desc1;
const desc2=req.body.desc2;
const time=req.body.time;
const price=req.body.price;
const data=await CarServicePackModel.findByIdAndUpdate(id,{
    warnOne:desc1,
    warnTwo:desc2,
    time:time,
    price:price
})
req.flash('success_msg',"Car Service Updated Successfully")
res.redirect('/carService')
}catch(err){
    req.flash('error_msg',"Something went wrong on updating Service")
res.redirect('/carService')
// res.status(400).json({messaage:"Something went wrong",err:err.messaage})
}
})


module.exports=router