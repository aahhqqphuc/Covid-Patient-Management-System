const express = require("express");
const addressM = require("../models/address.M");
const router = express.Router();

router.post("/get-district", async (req, res) => {
  let data = await addressM.getDistrictByProvinceId(req.body.provinceId);

  res.json({
    msg: "success",
    data: data,
  });
});

router.post("/get-commune", async (req, res) => {
  let data = await addressM.getCommuneByDistrictId(req.body.districtId);
  res.json({
    msg: "success",
    data: data,
  });
});

module.exports = router;
