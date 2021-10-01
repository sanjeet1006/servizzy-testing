const mongoose = require('../connection');

const OrderModelSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId
      },
      userDetails: {
         type: Object,
      },
      carDetails: {
         type: Object,
      },
      items: {
         type: Array
      },
      total: {
         type: String,
      },
      pickUpAddress: {
         type: String,
      },
      paymentType: {
         type: String,
      },
      orderStatus: {
         type: String,
         default: false,
      },
      time: {
         type: Date,
         default: Date.now
      },
      paymentId: {
         type: String,
      },
      pickUpDate: {
         type: String,
      },
      pickUpSlot: {
         type: String,
      },
      createDate: {
         type: String,
      },
      odometerReading: {
         type: String,
         default: '0',
      },
      serviceDate:{
         type:String
      },
      serviceType:{
         type:String
      },
      invoiceAmount:{
         type:String
      },
      dealerName:{
         type:String
      },
      invoicePDF:{
         type:String
      },
      cloudinary_id:{
         type:String
      },
      nextServiceDate:{
         type:String
      },
      nextServiceKms:{
         type:String
      }
   }, { timestamps: true, }
);

module.exports = mongoose.model('OrderModel', OrderModelSchema);
