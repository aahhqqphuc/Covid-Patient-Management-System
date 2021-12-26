const express = require("express");
const router = express.Router();
const patientM = require("../models/patient.M");
const provinceM = require("../models/province.M");
const stateHistoryM = require("../models/stateHistory.M");
const stateM = require("../models/state.M");
const relatedPatientM = require("../models/relatedPatient.M");

router.get("/add", async (req, res) => {
  let patient = await patientM.all();
  let province = await provinceM.all();
  let state = await stateM.all();
  res.render("patients/add", {
    patients: patient,
    provinces: province,
    states: state,
  });
});

router.post("/add", async (req, res) => {
  let createdDate = new Date();

  let patient = {
    ho_ten: req.body.name,
    cmnd: req.body.id,
    nam_sinh: req.body.yob,
    tinh: req.body.province,
    huyen: req.body.district,
    xa: req.body.commune,
    ngay_tao: createdDate,
  };
  let result = await patientM.add(patient);

  let stateHistory = {
    id_benh_nhan: result[0].id_benh_nhan,
    id_trang_thai: req.body.state,
    ngay_tao: createdDate,
    status: 1,
  };
  await stateHistoryM.add(stateHistory);

  let relatedPatient = {
    id_nguoi_lay: req.body["related-patient"],
    id_nguoi_lien_quan: result[0].id_benh_nhan,
    noi_tiep_xuc_tinh: req.body["related-province"],
    noi_tiep_xuc_huyen: req.body["related-district"],
    noi_tiep_xuc_xa: req.body["related-commune"],
  };
  await relatedPatientM.add(relatedPatient);

  res.render("home");
});

router.get("/change-state", async (req, res) => {
  res.render("patients/change-state", {});
});

router.get("/all", async (req, res) => {
  let data = await patientM.all();
  res.send(data);
});

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

module.exports = router;
