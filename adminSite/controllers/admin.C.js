const express = require("express");
const router = express.Router();
const model = require("../models/admin.M");
const TreatmentPlacemodel = require("../models/treatmentPlace.M");
const patientModel = require("../models/patient.M");
const accountUlt = require("../utils/account");

router.get("/", async (req, res) => {
  const page = +req.query.page || 1;
  const pagesize = +req.query.pagesize || 5;
  const result = await model.getPaging(page, pagesize);
  res.render("admin/adminAccountList", {
    layout: "adminLayout",
    admin: result.data,
    pagination: { page: parseInt(page), limit: pagesize, totalRows: result.total },
  });
});

router.get("/hospital", async (req, res) => {
  const page = +req.query.page || 1;
  const pagesize = +req.query.pagesize || 5;
  const data = await TreatmentPlacemodel.getPaging(page, pagesize);
  const search = req.query.search || "";
  const asc = req.query.asc;
  const tinh = req.body.tinh || "All";
  const tinh_place = await patientModel.getTinh(tinh);
  res.render("admin/adminHospital", {
    layout: "adminLayout",
    hospital: data.data,
    tinh_place: tinh_place,
    pagination: {
      page: parseInt(page),
      limit: pagesize,
      totalRows: data.total,
      queryParams: { tinh: tinh, search: search, asc: asc },
    },
  });
});

router.get("/hospital-filter", async (req, res) => {
  const page = +req.query.page || 1;
  const pagesize = +req.query.pagesize || 5;
  const search = req.query.search || "";
  const tinh = req.query.tinh || "All";
  const tinh_place = await patientModel.getTinh(tinh);
  const data = await TreatmentPlacemodel.filter(tinh, search, page, pagesize);
  res.render("admin/adminHospital", {
    layout: "adminLayout",
    hospital: data.data,
    tinh_place: tinh_place,
    pagination: {
      page: parseInt(page),
      limit: pagesize,
      totalRows: data.total,
      queryParams: { tinh: tinh, search: search },
    },
  });
});

router.get("/detail-filter", async (req, res) => {
  const page = +req.query.page || 1;
  const pagesize = +req.query.pagesize || 5;
  const id = req.query.id || 0;
  const data = await model.getdetail(id, page, pagesize);

  const user_name = await model.getUsername(id);
  res.render("admin/adminAccountLogDetail", {
    layout: "adminLayout",
    detail: data.data,
    account: user_name[0],
    pagination: {
      page: parseInt(page),
      limit: pagesize,
      totalRows: data.total,
      queryParams: { id: id },
    },
  });
});

router.get("/lock", async (req, res) => {
  const data1 = await model.lockAccount(req.query.id);
  res.redirect("/admin");
});

router.get("/unlock", async (req, res) => {
  const data1 = await model.unlockAccount(req.query.id);
  res.redirect("/admin");
});

router.get("/detail-filter/delete", async (req, res) => {
  const data1 = await model.deleteAction(req.query.id);
  res.redirect("/admin");
});

router.get("/register", async (req, res) => {
  res.render("admin/adminAccountRegister", {
    layout: "adminLayout",
    display: `none`,
  });
});

router.post("/register", async (req, res) => {
  var username = req.body.user_name;
  var psw = req.body.password;
  var cofpsw = req.body.confpassword;
  if (psw != cofpsw) {
    res.render("admin/adminAccountRegister", {
      message: "Password confirm is incorrect",
      layout: "adminLayout",
      display: `block`,
    });
    return;
  }
  let user = await model.findUser(username);

  if (typeof user !== "undefined" && user.length > 0) {
    res.render("admin/adminAccountRegister", {
      message: "Account already exists",
      layout: "adminLayout",
      display: `block`,
    });
    return;
  } else {
    user = accountUlt.createAccountManager(username, psw);
    const rs = await model.adduser(user);
    res.redirect("/admin");
  }
});

router.get("/hospital-register", async (req, res) => {
  res.render("admin/adminHospitalRegister", {
    layout: "adminLayout",
    display: `none`,
  });
});

router.post("/hospital-register", async (req, res) => {
  const rs = await TreatmentPlacemodel.addnew(req.body);

  res.redirect("/admin/hospital");
});

router.get("/hospital-detail", async (req, res) => {
  const data = await TreatmentPlacemodel.getbyID(req.query.id);
  res.render("admin/adminHospitalEdit", {
    layout: "adminLayout",
    display: `none`,
    place: data[0],
  });
});

router.post("/hospital-detail", async (req, res) => {
  const rs = await TreatmentPlacemodel.addnew(req.body);

  res.redirect("/admin/hospital");
});

module.exports = router;
