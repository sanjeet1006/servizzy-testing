const express = require('express');
const router = express.Router();
const adminModel=require('../model/Schema/adminSchema');
const bcrypt=require('bcrypt')
const authenticate=require('../middleware/auhenticate');
const checkmail=require('../middleware/checkEMail')

router.get('/addAdmin',authenticate,async(req,res)=>{
  if(req.user.role=='superAdmin'){
      const data=await adminModel.find({},'-password')
      res.render('addAdmin',{data:data,role:req.user.role})
  }
  else{
      req.flash('error_msg','You can not add admin. Login as superAdmin')
      res.redirect('/services')
  }

})

router.get('/admin/delete/:id',authenticate,async(req,res)=>{
  const id=req.params.id;
  try{
  const data=await adminModel.findByIdAndDelete({_id:id})
  req.flash('success_msg','admin deleted Successfully')
  res.redirect('/addAdmin')
  // res.status(200).json({message:"User deleted Successfully",success:true})
  }catch(err){
    req.flash('error_msg','Something Went Wrong')
  res.redirect('/addAdmin')
    // res.status(400).json({message:"Something Went Wrong",success:false,err:err})
  }
})


router.post('/addAdmin',checkmail,async(req,res)=>{
  const {name,email,password,confPassword}=req.body
  try{
    let errors=[];
        if(!name || !email || !password || !confPassword){
            errors.push({msg:"All Fields required"});
        }
        if(password != confPassword ){
            errors.push({msg:"Password did not match"});
        }
        if(errors.length > 0){
          res.render('addAdmin',{errors:errors,name,email,password,confPassword,role:'',data:''})
              }
          else{
            const encryptPassword=bcrypt.hashSync(password,10);
            const admindata=new adminModel({
             name,email,password:encryptPassword
            })
            const data=await admindata.save();
            // res.status(201).json({message:"Admin registered Successfully",success:true,data:data})
            req.flash('success_msg','Admin Added Successfully')
            res.redirect('/addAdmin')
          }
  }catch(err){
    req.flash('error_msg','Something went wrong')
res.redirect('/addAdmin')
// res.status(400).json({message:"Something went wrong",success:false,err:err})
  }
})

router.post('/login',async(req,res)=>{
  try{
    const {email,password}=req.body
    if(!email || !password){
      req.flash('error_msg',"email and password cannot be blank")
    return  res.redirect('/')
      // return res.status(400).json({message:"email and password cannot be blank"});
    }
    const user=await adminModel.findOne({email:email})
    if(!user){
      req.flash('error_msg',"user not registered")
    return  res.redirect('/')
      //  res.status(400).json({message:"user not registered"})
    }
  else{
    const isMatched=bcrypt.compareSync(password,user.password)
    if(!isMatched){
      req.flash('error_msg',"Invalid Credentials")
     return res.redirect('/')
      //  res.status(400).json({message:"Invalid Credentials",success:false})
    }
    else{
      const token=await user.generateToken();
      res.cookie('servizzyJwtToken',token,{
        expires:new Date(Date.now()+ 2592000000)  
      })
      // res.status(200).json({message:"admin login Successfully",success:true})
      res.redirect('/services')
      // res.redirect('http://localhost:3000/services')
    }
  }
  }catch(err){
    console.log(err)
    res.redirect('/')
// res.status(400).json({message:"Something went wrong",err:err.message})
  }
  
})

router.get('/logout',authenticate,async(req,res)=>{
try{
  req.user.tokens=req.user.tokens.filter((currElement)=>{
    return currElement.token!==req.token
  })
  res.clearCookie('servizzyJwtToken')
  await req.user.save();
  res.redirect('/')
}catch(err){
  res.status(500).send(err);
}
})


// router.get('/',(req,res)=>{
//   res.render('login');
// })

router.get('/',(req,res)=>{
  if(req.cookies.servizzyJwtToken){
      res.redirect('/services')
  }
  else{
      res.render('login')
  }
 })


module.exports = router;



