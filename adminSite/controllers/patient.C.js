const express = require("express");
const router = express.Router();
const patientM = require("../models/patient.M");
const provinceM = require("../models/province.M");
const stateHistoryM = require("../models/stateHistory.M");
const stateM = require("../models/state.M");
const relatedPatientM = require("../models/relatedPatient.M");
const treatmentHistoryM = require("../models/treatmentHistory.M");
const treatmentPlaceM = require("../models/treatmentPlace.M");

router.get("/add", async (req, res) => {
  let patient = await patientM.all();
  let province = await provinceM.all();
  let state = await stateM.all();
  res.render("patient/add", {
    layout:'managerLayout',
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
    layout:'managerLayout',
  };
  await relatedPatientM.add(relatedPatient);

  res.render("patient/patientList");
});

router.get("/change-state/:id", async (req, res) => {
  let id = req.params.id;
  let patient_state = await stateHistoryM.get_cur(id);
  let states = await stateM.all();

  res.render("patient/change-state", {
    id: id,
    patient_state: patient_state.trang_thai,
    states: states,
    layout:'managerLayout',
  });
});

router.post("/change-state/:id", async (req, res) => {
  let id = req.params.id;
  await stateHistoryM.edit(id);

  let stateHistory = {
    id_benh_nhan: id,
    id_trang_thai: req.body.state,
    ngay_tao: new Date(),
    status: 1,
  };
  await stateHistoryM.add(stateHistory);

  res.render("patient/patientList", {layout:'managerLayout',});
});

router.get("/change-place/:id", async (req, res) => {
  let id = req.params.id;
  let cur_placce = await treatmentHistoryM.get_cur(id);
  let places = await treatmentPlaceM.all();

  res.render("patient/change-place", {
    id: id,
    cur_placce: cur_placce.tennoidieutri,
    places: places,
    layout:'managerLayout',
  });
});

router.post("/change-place/:id", async (req, res) => {
  let id = req.params.id;
  await treatmentHistoryM.edit(id);

  let treatmentHistory = {
    id_benh_nhan: id,
    mavitri: req.body.place,
    ngay_tao: new Date(),
    status: 1,
  };
  await treatmentHistoryM.add(treatmentHistory);

  res.render("patient/patientList", {layout:'managerLayout',});
});

router.get("/all", async (req, res) => {
  let data = await patientM.all();
  res.send(data);
});

router.get("/", async (req, res) => {
  const data = await patientM.get();
  res.render("patient/patientList", {
    patients: data,
    
    layout:'managerLayout',
  });
});

router.get("/detail", async (req, res) => {
  const patient = await patientM.get_patient(req.query.id);
  const data = await patientM.detail_treatHis(req.query.id);
  const patientTrailDown = await patientM.viewPatientsDetail_PatientTrailDown(req.query.id);
  const patientTrailUp = await patientM.viewPatientsDetail_PatientTrailUp(req.query.id);
  res.render("patient/patientDetail", {
    patient: patient[0],
    detail: data,
    trailDown: patientTrailDown,
    trailUp: patientTrailUp,
    
    layout:'managerLayout',
  });
});

module.exports = router;
