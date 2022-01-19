const express = require("express");
const router = express.Router();
const patientM = require("../models/patient.M");
const provinceM = require("../models/province.M");
const stateHistoryM = require("../models/stateHistory.M");
const stateM = require("../models/state.M");
const relatedPatientM = require("../models/relatedPatient.M");
const treatmentHistoryM = require("../models/treatmentHistory.M");
const treatmentPlaceM = require("../models/treatmentPlace.M");
const accountM = require("../models/account.M");
const { createAccount } = require("../utils/account");
const axios = require("axios");
const { auth } = require("../utils/auth");

router.get("/add", async (req, res) => {
  let patient = await patientM.all();
  let province = await provinceM.all();
  let state = await stateM.all();

  res.render("patient/add", {
    layout: "managerLayout",
    patients: patient,
    provinces: province,
    states: state,
  });
});

router.post("/add", auth, async (req, res) => {
  let createdDate = new Date();

  let patient = {
    ho_ten: req.body.name,
    cmnd: req.body.id,
    nam_sinh: req.body.yob,
    tinh: req.body.province,
    huyen: req.body.district,
    xa: req.body.commune,
    createddate: createdDate,
  };
  let result = await patientM.add(patient);

  let stateHistory = {
    id_benh_nhan: result[0].id_benh_nhan,
    trang_thai: req.body.state,
    ngay_tao: createdDate,
    ngay_cap_nhat: createdDate,
    status: 1,
  };
  await stateHistoryM.add(stateHistory);

  let relatedPatient = {
    id_nguoi_lay: req.body.related_patient,
    id_nguoi_bi_lay: result[0].id_benh_nhan,
    noi_tiep_xuc_tinh: req.body.related_province,
    noi_tiep_xuc_huyen: req.body.related_district,
    noi_tiep_xuc_xa: req.body.related_commune,
  };
  await relatedPatientM.add(relatedPatient);

  const user = await createAccount(req.body.id, req.body.id);

  user.id_benh_nhan = result[0].id_benh_nhan;

  await accountM.add(user);

  axios({
    method: "post",
    url: "http://localhost:3001/payment/add",
    responseType: "json",
    data: {
      patientId: result[0].id_benh_nhan,
    },
    headers: {
      Authorization: "Bearer " + req.cookies.jwt,
    },
  })
    .then(function (response) {
      res.status(200).json({
        msg: "success",
      });
    })
    .catch(function (err) {
      console.log("err /payment/add", err);
    });
});

router.get("/change-state/:id", async (req, res) => {
  let id = req.params.id;
  let patient_state = await stateHistoryM.get_cur(id);
  let states = await stateM.all();

  res.render("patient/change-state", {
    id: id,
    state: patient_state.ten_trang_thai,
    states: states,
    layout: "managerLayout",
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

  res.render("patient/patientList", { layout: "managerLayout" });
});

router.get("/change-place/:id", async (req, res) => {
  let id = req.params.id;
  let cur_place = await treatmentHistoryM.get_cur(id);
  let places = await treatmentPlaceM.all();

  res.render("patient/change-place", {
    id: id,
    place: cur_place.tennoidieutri,
    places: places,
    layout: "managerLayout",
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

  res.render("patient/patientList", { layout: "managerLayout" });
});

router.get("/all", async (req, res) => {
  let data = await patientM.all();
  res.send(data);
});

router.get("/", async (req, res) => {
  const data = await patientM.get();
  res.render("patient/patientList", {
    patients: data,

    layout: "managerLayout",
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

    layout: "managerLayout",
  });
});

router.get("/check-id-number", async (req, res) => {
  const idNumber = req.query.idNumber;

  const check = await patientM.checkExistsIdNumber(idNumber);

  res.status(200).json({
    msg: "success",
    check: check,
  });
});

module.exports = router;
