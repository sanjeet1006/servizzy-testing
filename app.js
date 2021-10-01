const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const session=require('express-session');
const flash=require('connect-flash');
const cors=require('cors')
require('dotenv').config();
app.locals.moment = require('moment');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
// app.use(express.static("uploads/storage"))
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge:1000*24*60*60}
}))
app.use(flash());
app.use(function(req,res,next){
  res.locals.session=req.session;
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg')
  next();
})


app.use('/',require('./routes/admin'));
app.use('/',require('./routes/services'));
app.use('/',require('./routes/manageUser'));
app.use('/',require('./routes/AcServiceRouter'))
app.use('/',require('./routes/BatteryReplacementService'))
app.use('/',require('./routes/carCleaningDetailingService'))
app.use('/',require('./routes/carInspectionService'))
app.use('/',require('./routes/carService'));
app.use('/',require('./routes/electricalRepairServices'))
app.use('/',require('./routes/windShieldService'))
app.use('/',require('./routes/paintJobService'));
app.use('/',require('./routes/mechanicalServices'))
app.use('/',require('./routes/insuranceService'))
app.use('/',require('./routes/wheelService'))
app.use('/',require('./routes/order'))
app.use('/',require('./routes/offlineOrder'))

app.listen(process.env.PORT || 3000,(err)=>{
if(err){
  console.log(`error in server creating ${err}`)
}
else{
  console.log("Server is up and running on port 3000")
}
})


