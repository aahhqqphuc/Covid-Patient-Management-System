const express = require("express");
const router = express.Router();
const model = require("../models/admin.M");
const TreatmentPlacemodel = require("../models/treatmentPlace.M");
const accountUlt = require("../utils/account")

router.get("/", async (req, res) => {
  const data = await model.get();
  res.render("admin/adminAccountList", {
    layout: "adminLayout",
    admin: data,
  });
});

router.get("/hospital", async (req, res) => {
  const data = await TreatmentPlacemodel.all();
  res.render("admin/adminHospital", {
    layout: "adminLayout",
    hospital: data,
  });
});

router.get("/detail", async (req, res) => {
  const data = await model.getdetail(req.query.id);
  const user_name = await model.getUsername(req.query.id);
  console.log(user_name[0]);
  res.render("admin/adminAccountLogDetail", {
    layout: "adminLayout",
    detail: data,
    account: user_name[0],
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
    

    user = accountUlt.createAccountManager(username,psw);
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
  console.log(req.body);

  const rs = await TreatmentPlacemodel.addnew(req.body);

  res.redirect("/admin/hospital");
});

module.exports = router;
