const express=require('express');
const router=express.Router();
const orderModel=require('../model/Schema/orderModel')
const registrationModel=require('../model/Schema/userModel');
const authenticate=require('../middleware/auhenticate')
const upload=require('../utils/multer');
const cloudinary=require('../utils/cloudinary')
const messagebird = require("messagebird")(process.env.MSSG_KEY);



let fileHandler = function (err) {
    if (err) {
      console.log("unlink failed", err);
    }
  };





router.get('/offlineOrder',authenticate,(req,res)=>{
    res.render('offlineOrder',{role:req.user.role})
})

 router.post('/offlineOrder',authenticate,upload.single('invoicePdf'),async(req,res)=>{    
    try{
const {name,phone,email,brandName,brandModel,fuelType,serviceName,createDate,serviceDate,serviceType,invoiceAmount,nextServiceDate,nextServiceKms,odometerReading,dealerName}=req.body;
const textSms=req.body.textSms;


 const result=await cloudinary.uploader.upload(req.file.path)
const phoneNoExist=await registrationModel.findOne({phoneNumber:phone});
let orderdata;
if(phoneNoExist){
orderdata=new orderModel({
    userDetails:{
        _id:phoneNoExist._id,
        name:phoneNoExist.name,
        phoneNumber:phoneNoExist.phoneNumber,
        email:phoneNoExist.email
    },
    carDetails:{
        suc:{
            userId:phoneNoExist._id,
            brandName:brandName,
            modelName:brandModel,
            fuelType:fuelType
        }
    },
    items:[{
        name:serviceName
    }],
    userId:phoneNoExist._id,
    paymentId:"Offline Order",
    createDate:createDate,
    serviceDate,
    serviceType,
    invoiceAmount,
    odometerReading,
    nextServiceDate,
    nextServiceKms,
    dealerName,
    orderStatus:"true",
    invoicePDF:result.secure_url,
    cloudinary_id:result.public_id
})
}
else{
    const registration=new registrationModel({
        name:name,
        email:email,
        phoneNumber:phone
    })
    const userData=await registration.save()
    orderdata=new orderModel({
        // "userDetails.name":phoneNoExist.name,
        // "userDetails.phoneNumber":phoneNoExist.phoneNumber,
        // "userDetails.email":phoneNoExist.email,
        userDetails:{
            _id:userData._id,
            name:name,
            phoneNumber:phone,
            email:email
        },
        carDetails:{
            suc:{
                userId:userData._id,
                brandName:brandName,
                modelName:brandModel,
                fuelType:fuelType
            }
        },
        items:[{
            name:serviceName
        }],
        userId:userData._id,
        paymentId:"Offline Order",
        createDate:createDate,
        serviceDate,
        serviceType,
        invoiceAmount,
        odometerReading,
        nextServiceDate,
        nextServiceKms,
        dealerName,
        orderStatus:"true",
        invoicePDF:result.secure_url,
        cloudinary_id:result.public_id
    })
}
 fs.unlink(req.file.path,fileHandler)
const data=await orderdata.save();
if(textSms!=''){
    messagebird.messages.create(
        {
          originator: "+917017797097 ",
          recipients: "91" +phone,
          body: `Hello ${name}, ${textSms} `,
        },
        (err, data) => {
          if (err) {
            console.log(err);
          }
        }
      );
}

 req.flash('success_msg','Order Created Successfully')
 res.redirect('/offlineOrder')
 //res.status(201).json({message:"order created Successfully",success:true,data:data})
    }
    catch(err){
        console.log(err)
         req.flash('error_msg','Something Went Wrong')
         res.redirect('/offlineOrder')
     
        // res.status(201).json({message:"Smething Went Wrong",success:false,err:err})
    }
})

module.exports=router;