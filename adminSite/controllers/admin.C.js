const express = require("express");
const router = express.Router();
const model = require("../models/admin.M");
const axios = require("axios");
module.exports = router;

router.get("/", async (req, res) => {
  const data = await model.all();
  res.render("Admin_AccountList", {
    admin: data,
    script:["../AdminList.js"],
  });
});





