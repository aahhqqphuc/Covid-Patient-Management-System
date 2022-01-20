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
const orderM = require("../models/order.M");
const { createAccount } = require("../utils/account");
const axios = require("axios");
const { auth, isManager } = require("../utils/auth");

router.get("/add", isManager, async (req, res) => {
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
router.post("/add", isManager, async (req, res) => {
  let createdDate = new Date();
  console.log("first");
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
  console.log(user);

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

router.get("/change-state/:id", isManager, async (req, res) => {
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

router.post("/change-state/:id", isManager, async (req, res) => {
  let id = req.params.id;
  await stateHistoryM.edit(id);

  let stateHistory = {
    id_benh_nhan: id,
    id_trang_thai: req.body.state,
    ngay_tao: new Date(),
    status: 1,
  };
  await stateHistoryM.add(stateHistory);

  return res.redirect("/patient");
});

router.get("/change-place/:id", isManager, async (req, res) => {
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

router.post("/change-place/:id", isManager, async (req, res) => {
  let id = req.params.id;
  await treatmentHistoryM.edit(id);

  let treatmentHistory = {
    id_benh_nhan: id,
    mavitri: req.body.place,
    ngay_tao: new Date(),
    ngay_cap_nhat: new Date(),
    status: 1,
  };
  await treatmentHistoryM.add(treatmentHistory);

  return res.redirect("/patient");
});

router.get("/all", isManager, async (req, res) => {
  let data = await patientM.all();
  res.send(data);
});

router.get("/", isManager, async (req, res) => {
  const data = await patientM.get();
  res.render("patient/patientList", {
    patients: data,

    layout: "managerLayout",
  });
});

router.get("/detail", isManager, async (req, res) => {
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

router.get("/check-id-number", isManager, async (req, res) => {
  const idNumber = req.query.idNumber;

  const check = await patientM.checkExistsIdNumber(idNumber);

  res.status(200).json({
    msg: "success",
    check: check,
  });
});
router.get("/order-history", async (req, res) => {
  const patientId = 9;
  const data = await orderM.orderHistory(patientId);
  console.log(data);

  res.render("patient/orderHistory", {
    layout: "patientLayout",
    orders: data,
  });
});
router.get("/order-history/:id", async (req, res) => {
  const id = req.params.id;
  const data = await orderM.orderHistoryDetail(id);
  console.log(data);
  res.render("patient/orderHistoryDetail", {
    layout: "patientLayout",
    package: data.package[0],
    products: data.products,
  });
});
router.get("/self", async (req, res) => {
  const page = +req.params.page || 1;
  const pagesize = +req.query.pagesize || 5;
  const patient = await patientM.get_patient(req.query.id);
  const data = await patientM.detail_treatHis(req.query.id, page, pagesize);
  res.render("patient/patientTreatHis", {
    patient: patient[0],
    detail: data.data,
    layout: "patientLayout",
    pagination1: { page: parseInt(page), limit: pagesize, totalRows: data.total },
  });
});
router.get("/paymentHistory", async (req, res) => {
  let so_du = 0,
    du_no = 0,
    data = [];
  await axios({
    method: "get",
    url: "https://localhost:3001/payment/payment-account/balance",
    responseType: "json",
    headers: { Authorization: `Bearer ${req.cookies.jwt}` },
  })
    .then(function (response) {
      so_du = response.data.so_du;
    })
    .catch(function (err) {
      console.log("err /payment/balance", err);
    });
  await axios({
    method: "get",
    url: "https://localhost:3001/payment/payment-account/debt",
    responseType: "json",
    headers: { Authorization: `Bearer ${req.cookies.jwt}` },
  })
    .then(function (response) {
      du_no = response.data.du_no;
    })
    .catch(function (err) {
      console.log("err /payment/debt", err);
    });
  await axios({
    method: "get",
    url: "https://localhost:3001/payment/transaction-history",
    responseType: "json",
    headers: { Authorization: `Bearer ${req.cookies.jwt}` },
  })
    .then(function (response) {
      data = response.data.giao_dich;
    })
    .catch(function (err) {
      console.log("err /payment/transaction-history", err);
    });
  return res.render("patient/paymentInfo", {
    so_du: so_du,
    du_no: du_no,
    layout: "patientLayout",
    data: data,
  });
});
router.get("/info", async (req, res) => {
  let id = req.user.patientId || 2;
  const data = await patientM.basicInfo(id);
  return res.render("patient/basicInfo", {
    layout: "patientLayout",
    patient: data[0],
  });
});
router.post("/deposit", async (req, res) => {
  // call api
  let amount = req.body.amount;
  await axios({
    method: "post",
    url: "https://localhost:3001/payment/payment-account/deposit",
    responseType: "json",
    headers: { Authorization: `Bearer ${req.cookies.jwt}` },
    data: { amount: amount },
  })
    .then(function (response) {
      return res.render("patient/basicInfo", {
        layout: "patientLayout",
        patient: data[0],
      });
    })
    .catch(function (err) {
      console.log("err /payment/transaction-history", err);
    });
  return res.render("patient/basicInfo", {
    layout: "patientLayout",
    patient: data[0],
  });
});
module.exports = router;
