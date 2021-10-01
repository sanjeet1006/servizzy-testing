const mongoose = require('../connection');

const PaintJobPacModelSchema = new mongoose.Schema(
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
         default: '60e57aff79f4f51cec5e4bdd'
      },
      image: {
         type: String
      }
   }
);
module.exports = mongoose.model('PaintJobPacModel', PaintJobPacModelSchema);