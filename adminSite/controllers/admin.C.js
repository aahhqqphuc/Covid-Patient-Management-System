const express = require("express");
const router = express.Router();
const model = require("../models/admin.M");
const axios = require("axios");
module.exports = router;

router.get("/", async (req, res) => {
  const data = await model.all();
  res.render("adminAccountList", {
    admin: data,
    script:["../adminList.js"],
  });
});





