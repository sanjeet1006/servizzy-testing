const mongoose=require('mongoose');
const config=require('./config');
mongoose.connect(config.dbURL,{poolSize:config.poolSize,useCreateIndex:true,useNewUrlParser:true,useFindAndModify:false,useUnifiedTopology:true},(err)=>{
    if(err){
        console.log("error in database connection "+err);
    }
    else{
        console.log("Mongo connection created");
    }
})

module.exports=mongoose;