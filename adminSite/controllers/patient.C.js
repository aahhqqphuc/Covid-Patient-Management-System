const express = require("express");
const router = express.Router();
const model = require("../models/patient.M");
const axios = require("axios");
module.exports = router;

router.get("/", async (req, res) => {
  const data = await model.all();
  res.render("patient/patientList", {
    patients: data,
    script: ["../patient/patientList.js"],
  });
});

router.get("/detail", async (req, res) => {
  const patient = await model.get_patient(req.query.id);
  const data = await model.detail_treatHis(req.query.id);
  const patientTrailDown = await model.viewPatientsDetail_PatientTrailDown(req.query.id);
  const patientTrailUp = await model.viewPatientsDetail_PatientTrailUp(req.query.id);
  res.render("patient/patientDetail", {
    patient: patient[0],
    detail: data,
    trailDown: patientTrailDown,
    trailUp: patientTrailUp,
    script: ["../patient/patientList.js"],
  });
});
