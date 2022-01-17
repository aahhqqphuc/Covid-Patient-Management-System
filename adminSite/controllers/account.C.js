const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { compare } = require("../utils/account");
const accountM = require("../models/account.M");
const { auth } = require("../utils/auth");

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

  const token = jwt.sign({ username: user[0].username, role: user[0].role }, process.env.TOKEN_SECRET, {
    expiresIn: 86400,
  });

  return res.status(200).json({
    success: true,
    msg: token,
    expiresIn: 86400,
  });
});

module.exports = router;
