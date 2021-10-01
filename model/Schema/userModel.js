const mongoose = require('../connection');

const RegistrationModelSchema = new mongoose.Schema(
   {
      name: {
         type: String
      },
      email: {
         type: String,
      },
      phoneNumber: {
         type: String,
      },
      password: {
         type: String,
      },
      phoneNumberTwo: {
         type: String,
      },
      dateOfBirth: {
         type: String,
      },
      pickUpAndDropAddress: {
         type: String,
      },
      city: {
         type: String,
      },

      gender: {
         type: String,
      },


   }
);

module.exports = mongoose.model('RegistrationModel', RegistrationModelSchema);
