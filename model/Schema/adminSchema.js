const mongoose=require('../connection');
const Schema=mongoose.Schema;
const jwt=require('jsonwebtoken')
const adminSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'admin'
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{timestamps:true})


adminSchema.methods.generateToken=async function(){
    try{
    const token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
    // console.log(token)
    this.tokens=this.tokens.concat({token:token});
    await this.save();
    return token;
    }catch(err){
console.log(err)
    }
}

const adminModel=mongoose.model('admin',adminSchema);
module.exports=adminModel