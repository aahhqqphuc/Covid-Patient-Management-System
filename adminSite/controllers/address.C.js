const express = require("express");
const communeM = require("../models/commune.M");
const districtM = require("../models/district.M");
const router = express.Router();

router.post("/get-district", async (req, res) => {
  let data = await districtM.getByProvince(req.body.provinceId);
  res.json({
    msg: "success",
    data: data,
  });
});

router.post("/get-commune", async (req, res) => {
  let data = await communeM.getByDistrict(req.body.districtId);
  res.json({
    msg: "success",
    data: data,
  });
});

module.exports = router;
