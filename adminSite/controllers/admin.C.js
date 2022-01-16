const express = require("express");
const router = express.Router();
const model = require("../models/admin.M");

router.get("/", async (req, res) => {
  const data = await model.all();
  res.render("admin/adminAccountList", {
    admin: data,
    script: ["../admin/adminList.js"],
  });
});

module.exports = router;
