const express = require("express");
const router = express.Router();
const paymenrSystemM = require("../models/paymentSystem.M");
const db = require("../models/db");

router.get("/level", async (req, res) => {
    try {
        const re = await paymenrSystemM.getLevel();
        res.json(re);
    } catch (error) {
        console.log("err/pSystem", error);
    }
});

router.post("/level", async (req, res) => {
    try {
        const re = await paymenrSystemM.updateLevel(req.body);
        return res.json({ "status": "success", data: re });
    } catch (error) {
        return res.json({ "status": "fail" });
    }
});

router.get("/payment-account", async (req, res) => {
    try {
        const re = await paymenrSystemM.getPaymentAccount();
        res.json(re);
    } catch (error) {
        console.log("err/pSystem", error);
    }
});

module.exports = router;
