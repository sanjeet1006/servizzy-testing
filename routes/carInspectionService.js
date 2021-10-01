const express=require('express');
const router=express.Router();
const CarInspectionPackModel=require('../model/Schema/CarInspectionPackModel');
const authenticate=require('../middleware/auhenticate')

router.post('/carInspection',authenticate,async(req,res)=>{
    const {brandName,brandModel,fuelType}=req.body
    try{
        const data=await CarInspectionPackModel.find({$and:[
            {"carDetails.brandName":brandName},
            {"carDetails.brandModel":brandModel},
            {"carDetails.fuelType":fuelType},
            {"title":{$in:[
                "Inspection/Diagnostics",
                "Waterlog Assistance",
                "Engine Issues"
            ]}}
        ]})
res.render('carInspectionService',{data:data,message:"No Service Available for",brandName,brandModel,fuelType,role:req.user.role})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/carInspection',authenticate,(req,res)=>{
    try{
     res.render('carInspectionService',{data:'',message:'',brandName:'',brandModel:'',fuelType:'',role:req.user.role})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong"})
    }
    })

router.get('/carInspection/:id',authenticate,async(req,res)=>{
    try{
        const id=req.params.id
        const data=await CarInspectionPackModel.findById({_id:id})
        res.render('editcarInspectionService',{data:data,role:req.user.role});
        // res.status(200).json({data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


router.post('/carInspection/edit',authenticate,async(req,res)=>{
try{
const id=req.body.id;
// console.log(id)
const desc1=req.body.desc1;
const desc2=req.body.desc2;
const time=req.body.time;
const price=req.body.price;
// console.log(desc1+" "+desc2+" "+time+" "+price)
const data=await CarInspectionPackModel.findByIdAndUpdate(id,{
    warnOne:desc1,
    warnTwo:desc2,
    time:time,
    price:price
})
// console.log(data);
req.flash('success_msg','Car Inspection Services Updated Successfully')
res.redirect('/carInspection')
}catch(err){
    req.flash('success_msg','Car Inspection Services Updated Successfully')
res.redirect('/carInspection')
// res.status(400).json({messaage:"Something went wrong",err:err.messaage})
}
})


module.exports=router