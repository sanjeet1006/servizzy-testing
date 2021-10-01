const express=require('express');
const router=express.Router();
const MecahanicalPackModel=require('../model/Schema/MecahanicalPackModel');
const authenticate=require('../middleware/auhenticate')

router.post('/mechanicalService',authenticate,async(req,res)=>{
    const {brandName,brandModel,fuelType}=req.body
    try{
        const data=await MecahanicalPackModel.find({$and:[{
            "carDetails.brandName":brandName},
            {"carDetails.brandModel":brandModel},
            {"carDetails.fuelType":fuelType},
            {"title":{
                $in:[
                    "Complete Engine Scanning",
                    "Complete Suspension Check-up",
                    "Clutch Set Change",
                    "Fluids Inspection",
                    "Engine Mounting Replacement",
                    "Front Shock Absorber Replacement",
                    "Rear Shock Absorber Replacement"
                ]
            }}
        ]})
res.render('mechanicalServices',{data:data,message:"No Service Available for",brandName,brandModel,fuelType,role:req.user.role})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/mechanicalService',authenticate,(req,res)=>{
    try{
     res.render('mechanicalServices',{data:'',message:'',brandName:'',brandModel:'',fuelType:'',role:req.user.role})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong"})
    }
    })

router.get('/mechanicalService/:id',authenticate,async(req,res)=>{
    try{
        const id=req.params.id
        const data=await MecahanicalPackModel.findById({_id:id})
        res.render('editmechanicalServices',{data:data,role:req.user.role});
        // res.status(200).json({data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


router.post('/mechanicalService/edit',authenticate,async(req,res)=>{
try{
const id=req.body.id;
const desc1=req.body.desc1;
const desc2=req.body.desc2;
const time=req.body.time;
const price=req.body.price;
const data=await MecahanicalPackModel.findByIdAndUpdate(id,{
    warnOne:desc1,
    warnTwo:desc2,
    time:time,
    price:price
})
req.flash('success_msg','Mechanical Services Updated Successfully')
res.redirect('/mechanicalService')
}catch(err){
    req.flash('error_msg','Something went wrong')
res.redirect('/mechanicalService')
// res.status(400).json({messaage:"Something went wrong",err:err.messaage})
}
})


module.exports=router