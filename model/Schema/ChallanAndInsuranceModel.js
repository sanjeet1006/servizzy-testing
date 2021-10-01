const mongoose = require('mongoose');

const ChallanAndInsuranceModelSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId
      },
      vehicalNumber: {
         type: String
      },
      insuranceName: {
         type: String
      },
      insurerExpiryDate: {
         type: String
      },
      alertMe: {
         type: String
      },
      customeDate: {
         type: String
      },
      alertAt:{
         type: String
      }

   }
);

module.exports = mongoose.model('ChallanAndInsuranceModel', ChallanAndInsuranceModelSchema);
