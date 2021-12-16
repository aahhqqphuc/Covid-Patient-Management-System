const express = require("express");
const router = express.Router();
const model = require("../models/patient.M");
const axios = require("axios");
module.exports = router;

router.get("/", async (req, res) => {
  const data = await model.all();
  console.log(data);
  res.render("PatientList", {
    patients: data,
  });
});


