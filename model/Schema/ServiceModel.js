const mongoose = require("mongoose");

const ServiceModelSchema = new mongoose.Schema({
  brandName: {
    type: String,
  },
  modelName: {
    type: String,
  },
  image: {
    type: String,
  },
  fuelType: {
    type: String,
  },
  registrationNumber: {
    type: String,
  },
  manufacYear: {
    type: String,
  },
  chassisNumber: {
    type: String,
  },
  engineNumber: {
    type: String,
  },
  insuranceNumber: {
    type: String,
  },
  insurerExpiryDate: {
    type: String,
  },
  policyName: {
    type: String,
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
   //  images: {type:[{type:String}],default:null},
  images: {
    type: [{ imageUrl: { type: String }  , imageFor: { type: String } }],
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const ServiceModel = mongoose.model("ServiceModel", ServiceModelSchema);
module.exports = ServiceModel;
