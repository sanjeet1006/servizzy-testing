const mongoose = require('../connection');

const ServicePackModelSchema = new mongoose.Schema(
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
         default: '60e6a6a3dddf6402938859c8'
      }
   }
);
module.exports = mongoose.model('ServicePackModel', ServicePackModelSchema);
