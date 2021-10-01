const mongoose = require("../connection");

const InsurenceServicePackModelSchema = new mongoose.Schema({
   title: {
      type: String,
   },
   warnOne: {
      type: String,
   },
   warnTwo: {
      type: String,
   },
   time: {
      type: String,
   },
   options: {
      type: Array,
   },
   price: {
      type: String,
   },
   carDetails: {
      brandName: {
         type: String,
      },
      brandModel: {
         type: String,
      },
      fuelType: {
         type: String,
      },
   },
   categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      default: "60fa4472d18b4a056ccd2aee",
   },
});
module.exports = mongoose.model(
   "InsurenceServicePackModel",
   InsurenceServicePackModelSchema
);
