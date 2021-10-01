const multer=require('multer')
const path=require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../uploads/'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })

  const fileFilter=(req,file,cb)=>{
if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='application/pdf' ){
cb(null,true);
}
else{
    cb(new Error("Not a valid file type"),false);
}
  }
const upload = multer({ 
    storage: storage,
    // limits:{
    //     fileSize:1024 *1024 *5
    // },
    fileFilter:fileFilter
 })
 module.exports=upload