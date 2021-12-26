const express = require("express");
const router = express.Router();
const model = require("../models/patient.M");
const axios = require("axios");
module.exports = router;

router.get("/", async (req, res) => {
  const data = await model.all();
  res.render("patientList", {
    patients: data,
    script:["../patientList.js"],
  });
});



router.get("/detail", async (req, res) => {
 
  const patient = await model.get_patient(req.query.id);
  const data = await model.detail_treatHis(req.query.id);
  const patientTrailDown = await model.viewPatientsDetail_PatientTrailDown(req.query.id);
  const patientTrailUp = await model.viewPatientsDetail_PatientTrailUp(req.query.id);
  res.render("patientDetail", {
    patient:patient[0],
    detail: data,
    trailDown: patientTrailDown,
    trailUp: patientTrailUp,
    script:["../patientList.js"],
  });
});


