const express = require("express");
const router = express.Router();
const pStatusM = require("../models/patientStatus.M");
const treatmentHistoryM = require("../models/treatmentHistory.M");
const orderM = require("../models/order.M");
const axios = require("axios");

// get time
const dnow = new Date();
const dateNow = `${dnow.getDate()}/${dnow.getMonth() + 1}/${dnow.getFullYear()}`;

router.get("/patient", async (req, res) => {
  const pStatus = await pStatusM.all();
  const treatmentHistory = await treatmentHistoryM.all();

  const pStatusNow = pStatus.filter((per) => {
    return per.ngay_cap_nhat.toString().includes(dateNow);
  });

  const pf0 = pStatus.filter((per) => {
    return per.trang_thai == 'F0';
  });
  const pf1 = pStatus.filter((per) => {
    return per.trang_thai == 'F1';
  });
  const pf2 = pStatus.filter((per) => {
    return per.trang_thai == 'F2';
  });
  const pf3 = pStatus.filter((per) => {
    return per.trang_thai == 'F3';
  });
  const pCured = pStatusNow.filter((per) => {
    return per.trang_thai == -1;
  });
  const pMove = treatmentHistory.filter((per) => {
    return per.ngay_cap_nhat.toString().includes(dateNow);
  });
  const totalCured = pStatus.filter((per) => {
    return per.trang_thai == -1;
  });

  res.render("statistic/patientStatistic", {
    layout: "managerLayout",
    timeUpdate: dateNow,
    f0: pf0.length,
    f1: pf1.length,
    f2: pf2.length,
    f3: pf3.length,
    cured: pCured.length,
    move: pMove.length,
    totalCured: totalCured.length,
    totalInfectted: totalCured.length + pf0.length,
  });
});

router.get("/product/:time", async (req, res) => {
  let timeLine = req.params.time || 'today';

  const productDetail = await orderM.getOrderProductDetail(timeLine);
  const packageDetail = await orderM.getOrderPackageDetail(timeLine);

  const numProduct = await orderM.countOrderProductDetail(timeLine);
  const numPackage = await orderM.countOrderPackageDetail(timeLine);

  if(timeLine == 'today'){
    timeLine = `ngày ${dateNow}`;
  }
  else if(timeLine == 'this-month'){
    timeLine = `tháng ${dnow.getMonth() + 1}/${dnow.getFullYear()}`
  }
  else if(timeLine == 'this-year'){
    timeLine = `năm ${dnow.getFullYear()}`
  }else {
    timeLine = 'toàn thời gian'
  }

  res.render("statistic/productStatistic", {
    time: timeLine,
    layout: "managerLayout",
    timeUpdate: dateNow,
    packages: packageDetail,
    products: productDetail,
    numPackage: numPackage,
    numProd: numProduct,
  });
});

router.get("/product", (req, res) => {
  res.redirect('/statistic/product/today');
}),

router.get("/payment", async (req, res) => {
  axios({
    method: "get",
    url: "http://127.0.0.1:3000/payment-system/payment-account",
    responseType: "json",
  })
    .then(function (response) {
      const paymentAccounts = response.data;

      const debtTotal = paymentAccounts.reduce((sum, item) => sum + parseInt(item.du_no), 0);

      res.render("statistic/paymentStatistic", {
        layout: "managerLayout",
        debtTotal,
        paymentAccounts 
      });
    })
    .catch(function (err) {
      console.log("err /payment ", err);
    });
});

module.exports = router;
