const mongoose = require('../connection');

const CarInspectionPackModelSchema = new mongoose.Schema(
   {
      title: {
         type: String
      },
      warnOne: {
         type: String
      },
      warnTwo: {
         type: String
      },
      time: {
         type: String
      },
      options: {
         type: Array
      },
      price: {
         type: String
      },
      carDetails: {
         brandName: {
            type: String,
         }, brandModel: {
            type: String,
         }, fuelType: {
            type: String,
         },
      },
      categoryId: {
         type: mongoose.Schema.Types.ObjectId,
         default: '60e57c1079f4f51cec5e4be2'
      }
   }
);
module.exports = mongoose.model('CarInspectionPackModel', CarInspectionPackModelSchema);
