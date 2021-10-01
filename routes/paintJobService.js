const express=require('express');
const router=express.Router();
const PaintJobModels=require('../model/Schema/PaintJobModels');
const authenticate=require('../middleware/auhenticate')

router.post('/paintService',authenticate,async(req,res)=>{
    const {brandName,brandModel,fuelType}=req.body
    try{
        const data=await PaintJobModels.find({$and:[{
            "carDetails.brandName":brandName},
            {"carDetails.brandModel":brandModel},
            {"carDetails.fuelType":fuelType},
            {"title":{$in:[
                "Bonnet Paint Job",
                "Front Bumper Paint Job",
                "Rear Bumper Paint Job",
                "Left Fender Paint Job",
                "Right Fender Paint Job",
                "Left Front Door Paint",
                "Left Rear Door Paint",
                "Right Rear Door Paint",
                "Right Front Door Paint",
                "Boot Paint Job",
                "Alloy Paint Job",
                "Full Body Dent Paint"
            ]}}
        ]})
res.render('paintJobService',{data:data,message:"No Service Available for",brandName,brandModel,fuelType,role:req.user.role})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/paintService',authenticate,(req,res)=>{
    try{
     res.render('paintJobService',{data:'',message:'',brandName:'',brandModel:'',fuelType:'',role:req.user.role})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong"})
    }
    })

router.get('/paintService/:id',authenticate,async(req,res)=>{
    try{
        const id=req.params.id
        const data=await PaintJobModels.findById({_id:id})
        res.render('editpaintJobService',{data:data,role:req.user.role});
        // res.status(200).json({data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


router.post('/paintService/edit',authenticate,async(req,res)=>{
try{
const id=req.body.id;
const desc1=req.body.desc1;
const desc2=req.body.desc2;
const time=req.body.time;
const price=req.body.price;
const data=await PaintJobModels.findByIdAndUpdate(id,{
    warnOne:desc1,
    warnTwo:desc2,
    time:time,
    price:price
})
req.flash('success_msg',"Paint Job Service Updated Successfully")
res.redirect('/paintService')
}catch(err){
    req.flash('error_msg',"Something went wrong")
res.redirect('/paintService')
// res.status(400).json({messaage:"Something went wrong",err:err.messaage})
}
})


module.exports=router