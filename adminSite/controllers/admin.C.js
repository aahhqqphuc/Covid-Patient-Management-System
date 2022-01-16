const express = require("express");
const router = express.Router();
const model = require("../models/admin.M");
const TreatmentPlacemodel = require("../models/treatmentPlace.M");
const axios = require("axios");
const bcrypt = require('bcrypt');
const passport = require("passport");
const saltRounds = 10;
module.exports = router;

router.get("/", async (req, res) => {
  const data = await model.get();
  res.render("admin/adminAccountList", {
    layout: 'adminLayout',
    admin: data,
    script: ["../js/adminList.js"],
  });
});

router.get("/hospital", async (req, res) => {
  const data = await TreatmentPlacemodel.get();
  res.render("admin/adminHospital", {
    layout: 'adminLayout',
    admin: data,
    script: ["../js/adminList.js"],
  });
});

router.get("/detail", async (req, res) => {
  const data = await model.getdetail(req.query.id);
  const user_name = await model.getUsername(req.query.id);
  console.log(user_name[0]);
  res.render("admin/adminAccountLogDetail", {
    layout: 'adminLayout',
    detail: data,
    account: user_name[0],
    script: ["../js/adminList.js"],
  });
});


router.get("/lock", async (req, res) => {
  const data1 = await model.lockAccount(req.query.id);
  res.redirect('/admin');
});


router.get("/unlock", async (req, res) => {
  const data1 = await model.unlockAccount(req.query.id);
  res.redirect('/admin');
});




router.get("/register", async (req, res) => {
  res.render("admin/adminAccountRegister", {
    layout: 'adminLayout',
    display:`none`
  });
});



router.post("/register", async (req, res) => {
  var username = req.body.user_name;
    var psw = req.body.password;
    var cofpsw = req.body.confpassword;
    var role = req.body.role; 
    if(psw != cofpsw)
    {
      res.render("admin/adminAccountRegister", {
        message:"Password confirm is incorrect",
        layout: 'adminLayout',
        display:`block`
      });
      return;
    }
    let user = await model.findUser(username);

    if(typeof user !== 'undefined' && user.length > 0)
    {
      res.render("admin/adminAccountRegister", {
        message:"Account already exists",
        layout: 'adminLayout',
        display:`block`
      });
      return;
    }
    else
    {
        var hashedpwd = await bcrypt.hash(psw, saltRounds);

        user ={
            id_tai_khoan: 'default',
            user_name: username,
            password: hashedpwd,
            role: role,
            status: 1,
        };
        console.log(user);
        const rs = await model.adduser(user);
        res.redirect('/admin')
    }
    
});

