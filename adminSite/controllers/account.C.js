const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { compare } = require("../utils/account");
const accountM = require("../models/account.M");
const accountUlt = require("../utils/account");

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
  });
});

router.post("/logout", async (req, res) => {
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
  });
});

router.get("/admin", async (req, res) => {
  console.log("fd");
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

module.exports = router;
