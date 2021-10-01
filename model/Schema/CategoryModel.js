const mongoose = require('../connection');

const CategoryModelSchema = new mongoose.Schema(
   {
      image: {
         type: String,
      },
      categoryName: {
         type: String,
      }
   }
);

module.exports = mongoose.model('CategoryModel', CategoryModelSchema);
