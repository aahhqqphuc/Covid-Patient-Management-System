const express = require("express");
const router = express.Router();
const limitM = require("../models/limit.M");
const paymentAccountM = require("../models/paymentAccount.M");
const transactionM = require("../models/transaction.M");
const { auth } = require("../utils/auth");

// get hạn mức
router.get("/limit", auth, async (req, res) => {
  const limit = await limitM.getLimit();

  res.status(200).json({
    msg: "success",
    han_muc: limit,
  });
});

// thay đổi hạn mức
router.put("/limit", auth, async (req, res) => {
  const result = await limitM.changeLimit(req.body);
  res.status(200).json({
    msg: "success",
    result: result,
  });
});

module.exports = router;
