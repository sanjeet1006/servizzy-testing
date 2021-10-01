const mongoose = require("../connection");

const AcServicePackModelSchema = new mongoose.Schema({
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
      default: "60e57cc579f4f51cec5e4be8",
   },
});
module.exports = mongoose.model("AcServicePackModel", AcServicePackModelSchema);
