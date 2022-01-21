const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { compare, hashPassword } = require("../utils/account");
const accountM = require("../models/account.M");
const accountUlt = require("../utils/account");
const { auth } = require("../utils/auth");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  //Check Exist Account
  const user = await accountM.findByUsername(req.body.username);
  if (user == false) {
    return res.status(200).json({
      success: false,
      msg: "Tài khoản hoặc mật khẩu không đúng",
    });
  }
  const validPass = await compare(req.body.password, user[0].password);
  if (!validPass) {
    return res.status(200).json({
      success: false,
      msg: "Tài khoản hoặc mật khẩu không đúng",
    });
  }

  const token = jwt.sign(
    { username: user[0].user_name, role: user[0].role, patientId: user[0].id_benh_nhan },
    process.env.TOKEN_SECRET,
    {
      expiresIn: 86400,
    }
  );

  return res.status(200).json({
    success: true,
    msg: token,
    expiresIn: 86400,
    role: user[0].role,
    active: user[0].active,
  });
});

router.get("/admin", async (req, res) => {
  const check = await accountM.findAdmin();

  if (check.length != 0) {
    return res.redirect("/");
  }

  res.render("admin/create", {
    display: `none`,
  });
});

router.post("/admin", async (req, res) => {
  var username = req.body.user_name;
  var psw = req.body.password;

  user = await accountUlt.createAccount(username, psw, "admin");

  await accountM.add(user);

  res.redirect("/admin");
});

router.get("/change-patient-pwd", auth, async (req, res) => {
  res.render("patient/change-password", {
    layout: "patientLayout",
    display: `none`,
  });
});

router.post("/change-patient-pwd", auth, async (req, res) => {
  const username = req.user.username;
  const oldPwd = req.body.oldPwd;
  let newPwd = req.body.newPwd;
  const cfPwd = req.body.cfPwd;

  const user = await accountM.findByUsername(username);

  if (!(await compare(oldPwd, user[0].password))) {
    return res.render("patient/change-password", {
      message: "Mật khẩu cũ sai",
      layout: "patientLayout",
      display: `block`,
    });
  }

  if (newPwd != cfPwd) {
    return res.render("patient/change-password", {
      message: "Mật khẩu mới không trùng khớp",
      layout: "patientLayout",
      display: `block`,
    });
  }

  newPwd = await hashPassword(newPwd);

  await accountM.changePwd(username, newPwd);

  await accountM.changeActive(username);

  return res.redirect("/product-package");
});

module.exports = router;
