const express = require("express");
const router = express.Router();
const model = require("../models/order.M");
const axios = require("axios");
module.exports = router;
router.get("/", async (req, res) => {
  const data = await model.all();
  console.log(data);
  res.render("home", {
    orders: data,
  });
});