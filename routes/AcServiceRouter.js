const express = require("express");
const router = express.Router();
const AcServicePackModel = require("../model/Schema/AcServiceModel");
const authenticate = require("../middleware/auhenticate");

router.post("/ACService", authenticate, async (req, res) => {
  const { brandName, brandModel, fuelType } = req.body;
  try {
    const data = await AcServicePackModel.find({
      $and: [
        {
          "carDetails.brandName": brandName,
        },
        {
          "carDetails.brandModel": brandModel,
        },
        {
          "carDetails.fuelType": fuelType,
        },
        {
          title: {
            $in: [
              "High Performance AC Service",
              "Cooling Coil Change",
              "Condenser Change",
              "Compressor Change",
              "V-Belt Change",
              "Radiator Change",
              "Radiator Flush & Clean",
            ],
          },
        },
      ],
    });
    res.render("AcService", {
      data: data,
      message: "No Service Available for",
      brandName,
      brandModel,
      fuelType,
      role:req.user.role
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something went wrong", success: false, err: err });
  }
});

router.get("/ACService", authenticate, (req, res) => {
  try {
    res.render("AcService", {
      data: "",
      message: "",
      brandName: "",
      brandModel: "",
      fuelType: "",
      role:req.user.role
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

router.get("/acServices/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await AcServicePackModel.findById({ _id: id });
    res.render("editAcServices", { data: data,role:req.user.role });
    // res.status(200).json({data:data})
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something went wrong", success: false, err: err });
  }
});

router.post("/acServices/edit", authenticate, async (req, res) => {
  try {
    const id = req.body.id;
    // console.log(id);
    const desc1 = req.body.desc1;
    const desc2 = req.body.desc2;
    const time = req.body.time;
    const price = req.body.price;
    const data = await AcServicePackModel.findByIdAndUpdate(
      { _id: id },
      {
        warnOne: desc1,
        warnTwo: desc2,
        price: price,
        time: time,
      }
    );

    req.flash("success_msg", "Ac Service Updated Successfully");
    res.redirect("/ACService");
  } catch (err) {
    req.flash("error_msg", "Something went wrong");
    res.redirect("/ACService");
    // res.status(400).json({messaage:"Something went wrong",err:err.messaage})
  }
});

module.exports = router;
