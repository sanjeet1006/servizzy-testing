const express = require("express");
const mongoose = require("mongoose");
const Router = express.Router();
const ServiceModel = require("../models/ServiceModel");
const { service } = require("../controller/serviceController");
const carDetailsValidation = require("../validation/carDetailsValidation");
const path = require("path");
const fs = require("fs");
const Busboy = require("busboy");
const BASE_URL = process.env.BASE_URL;
// const cloudinary = require("cloudinary").v2;
// update image
/*
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
*/

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.

const busyBoyFileParser = async (req, res, next) => {
  const busboy = new Busboy({ headers: req.headers });

  // This object will accumulate all the fields, keyed by their name
  const bodyFields = {};

  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = new Object();

  // This code will process each non-file field in the form.
  busboy.on("field", (fieldname, val) => {
    // console.log(`Processed field ${fieldname}: ${val}.`);
    bodyFields[fieldname] = val;
  });

  const fileWrites = [];

  // This code will process each file uploaded.
  busboy.on("file", (fieldname, file, filename) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    // console.log(`Processed file ${filename}`);
    req.imageField = fieldname;
    const fileName = Date.now() + "-" + filename;
    const filepath = path.join(__dirname, "../uploads", fileName);
    if (Object.keys(uploads).length === 0) {
      uploads[fieldname] = [fileName];
      console.log(uploads);
    } else {
      uploads[fieldname] = [...uploads[fieldname], fileName];
    }

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    // File was processed by Busboy; wait for it to be written.
    // Note: GCF may not persist saved files across invocations.
    // Persistent files must be kept in other locations
    // (such as Cloud Storage buckets).
    const promise = new Promise((resolve, reject) => {
      file.on("end", () => {
        writeStream.end();
      });
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  busboy.on("finish", async () => {
    await Promise.all(fileWrites);

    /**
     * TODO(developer): Process saved files here
     */
    // for (const file in uploads) {
    //   fs.unlinkSync(uploads[file]);
    // }
    // res.send();
    req.bodyFields = bodyFields;
    req.uploads = uploads;
    next();
  });

  busboy.end(req.rawBody);
};

// save car details
Router.post("/add-car-details", service);

// get one car details
Router.get("/get-car-details", (req, res) => {
  const userId = req.headers["userid"];
  if (!userId) {
    res.status(422).json({
      message: "Incomplete Details",
      error: "Send userid by headers",
      success: false,
    });
  } else {
    ServiceModel.find({ userId: userId })
      .sort({ isActive: -1, _id: -1 })
      .then((data) => {
        // if (err) {
        //   res.status(500).json({
        //     message: "Something went wrong",
        //     error: err,
        //     success: false,
        //   });
        // } else {
        res.status(200).json({
          message: "Car Details",
          success: true,
          data: data,
        });
        // }
      });
  }
});

Router.put("/current-car-details", async (req, res) => {
  const oldCarId = req.headers["ocarid"];
  const newCarId = req.headers["ncarid"];
  if (!oldCarId || !newCarId) {
    return res.status(422).json({
      message: "Incomplete Details",
      error: "Send ocarid and ncarid by headers",
      success: false,
    });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const old = await ServiceModel.findOneAndUpdate(
      { _id: oldCarId },
      { isActive: false },
      { new: true }
      // { session: session }
    ).session(session);
    const new_c = await ServiceModel.findOneAndUpdate(
      { _id: newCarId },
      { isActive: true },
      { new: true }
      // { session: session }
    ).session(session);
    await session.commitTransaction();
    session.endSession();
    res.json({
      message: "current car updated successfully.",
      success: true,
      current_car: new_c,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      message: "Something Failed(transaction error)",
      success: false,
      error: err.message,
    });
  }
});

// update car details
Router.put("/update-car-details", (req, res) => {
  const carDetailsId = req.headers["id"];
  const { brandName, modelName, fuelType } = req.body;
  ServiceModel.findByIdAndUpdate(
    carDetailsId,
    {
      brandName: brandName,
      modelName: modelName,
      fuelType: fuelType,
    },
    { new: true },
    //  { upsert: true },
    (err, results) => {
      if (err) {
        res.json({
          messag: err.message,
          status: 501,
          error: "Something went wrong. Please try again later",
          success: false,
        });
      } else {
        res.status(201).json({
          messag: "Card details updated",
          status: 201,
          success: true,
          data: results,
        });
      }
    }
  );
});

// delete a car details
Router.delete("/delete-car-details", (req, res) => {
  const detailsId = req.headers["id"];
  if (detailsId) {
    ServiceModel.findByIdAndDelete(detailsId, function (err, results) {
      if (err) {
        res.status(500).json({
          message: "Something went wrong",
          error: err,
          success: false,
        });
      } else {
        res.status(200).json({
          message: "Car Details deleted success",
          success: true,
        });
      }
    });
  } else {
    res.status(422).json({
      message: "Incomplete Details",
      error: "Send id by headers",
      success: false,
    });
  }
});

// get all car details
Router.get("/test", (req, res) => {
  ServiceModel.find().then((data) => {
    res.json({
      data: data,
    });
  });
});

// complete car details
Router.post("/complete-car-details", busyBoyFileParser, async (req, res) => {
  const userId = req.headers["userid"];
  const carId = req.headers["carid"];
  const imageField = req.imageField;
  // console.log(req.files);
  // console.log(req.body);
  // console.log(req.bodyFields);
  // console.log(req.uploads);
  // console.log(carId)
  const {
    registrationNumber,
    manufacYear,
    chassisNumber,
    engineNumber,
    insuranceNumber,
    insurerExpiryDate,
    policyName,
    reminder,
  } = req.bodyFields;
  // const cloudinary = require("cloudinary").v2;
  let images = [];
  let cloudinary_ids = [];

  if (req.uploads[imageField]) {
    //cloudinary image upload
    // await (async function () {
    //   for (x of req.files) {
    //     const result = await cloudinary.uploader.upload(x.path, {
    //       folder: "servizzy/profiles",
    //     });
    //     images.push({
    //       imageUrl: result.secure_url,
    //       imageFor: x.originalname,
    //     });
    //     cloudinary_ids.push(result.public_id);
    //   }
    // })();

    //normal image upload
    for (x of req.uploads[imageField]) {
      images.push({
        imageUrl: x,
        imageFor: x,
      });
    }
  }

  const validation = carDetailsValidation({
    carId,
    registrationNumber,
    manufacYear,
  });

  if (!validation.isValid) {
    res.status(400).json({
      message: "Incomplete details",
      success: false,
      error: validation.error,
    });
  } else {
    // const imageLength = req.files && req.files.length === 0;
    // console.log(images);

    if (req.uploads[imageField]) {
      // await ServiceModel.findByIdAndUpdate(
      //   carId,
      //   {
      //     $pull: {
      //       images: { imageFor: { $in: images.map((x) => x.imageFor) } },
      //     },
      //     // image: images.length === 0 ?null:images,
      //   },
      //   { new: true }
      // );
      const UpdateCarDetails = ServiceModel.findByIdAndUpdate(
        carId,
        {
          registrationNumber: registrationNumber,
          manufacYear: manufacYear,
          chassisNumber: chassisNumber,
          engineNumber: engineNumber,
          insuranceNumber: insuranceNumber,
          insurerExpiryDate: insurerExpiryDate,
          policyName: policyName,
          reminder: reminder,
          // images: req.files,
          $push: { images: { $each: images } },
          // image: images.length === 0 ?null:images,
        },
        { new: true }
      )
        .then((data) => {
          res.status(200).json({
            message: "Thanks for add more details",
            success: true,
            data: data,
            carId: data._id,
            userId: data.userId,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Server error",
            success: false,
            error: error,
          });
        });
    } else {
      const UpdateCarDetails = ServiceModel.findByIdAndUpdate(
        carId,
        {
          registrationNumber: registrationNumber,
          manufacYear: manufacYear,
          chassisNumber: chassisNumber,
          engineNumber: engineNumber,
          insuranceNumber: insuranceNumber,
          insurerExpiryDate: insurerExpiryDate,
          policyName: policyName,
          reminder: reminder,
        },
        { new: true }
      )
        .then((data) => {
          res.status(200).json({
            message: "Thanks for add more details",
            success: true,
            data: data,
            carId: data._id,
            userId: data.userId,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Server error",
            success: false,
            error: error,
          });
        });
    }
  }
});

module.exports = Router;
