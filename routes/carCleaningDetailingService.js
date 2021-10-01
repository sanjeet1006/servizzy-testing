const express=require('express');
const router=express.Router();
const carCleaingModel=require('../model/Schema/CarCleaningModel');
const authenticate=require('../middleware/auhenticate')
router.post('/cleaningService',authenticate,async(req,res)=>{
    const {brandName,brandModel,fuelType}=req.body
    try{
        const data=await carCleaingModel.find({$and:[
            {"carDetails.brandName":brandName},
            {"carDetails.brandModel":brandModel},
            {"carDetails.fuelType":fuelType},
            {title:{$in:[
                "Rat Resistant Treatment", 
                "Deep Cleaning Exterior & Interior Package", 
                "Interior Cleaning Package",
                "Standard Package", 
                "Ceramic Coating & Treatment", 
            ]}}
        ]})
res.render('carCleaningDetailingService',{data:data,message:"No Service Available for",brandName,brandModel,fuelType,role:req.user.role})
    }catch(err){
res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})

router.get('/cleaningService',authenticate,(req,res)=>{
    try{
     res.render('carCleaningDetailingService',{data:'',message:'',brandName:'',brandModel:'',fuelType:'',role:req.user.role})
    }
    catch(err){
        res.status(400).json({message:"Something went wrong"})
    }
    })

router.get('/cleaningService/:id',authenticate,async(req,res)=>{
    try{
        const id=req.params.id
        const data=await carCleaingModel.findById({_id:id})
        res.render('editcarCleaningDetailingService',{data:data,role:req.user.role});
        // res.status(200).json({data:data})
    }catch(err){
        res.status(400).json({message:"Something went wrong",success:false,err:err})
    }
})


router.post('/cleaningService/edit',authenticate,async(req,res)=>{
try{
const id=req.body.id;
console.log(id)
const desc1=req.body.desc1;
const desc2=req.body.desc2;
const time=req.body.time;
const price=req.body.price;
const data=await carCleaingModel.findByIdAndUpdate({_id:id},{
    warnOne:desc1,
    warnTwo:desc2,
    time:time,
    price:price
})
req.flash('success_msg','Car Cleaning and Detailing Service Updated Successfully')
res.redirect('/cleaningService')
}catch(err){
req.flash('error_msg','Something went wrong')
res.redirect('/cleaningService')
// res.status(400).json({messaage:"Something went wrong",err:err.messaage})
}
})


module.exports=router