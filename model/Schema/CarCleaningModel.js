const mongoose = require('../connection');

const CarCleaningAndDetailingModelSchema = new mongoose.Schema(
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
         default: '60e57b2679f4f51cec5e4bde'
      }
   }
);
module.exports = mongoose.model('CarCleaningAndDetailingModel', CarCleaningAndDetailingModelSchema);
