const express = require("express");
const router = express.Router();
const pStatusM = require("../models/patientStatus.M");
const patientM = require("../models/patient.M");
const treatmentHistoryM = require("../models/treatmentHistory.M");
const db = require("../models/db");
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
    return per.trang_thai == 0;
  });
  const pf1 = pStatus.filter((per) => {
    return per.trang_thai == 1;
  });
  const pf2 = pStatus.filter((per) => {
    return per.trang_thai == 2;
  });
  const pf3 = pStatus.filter((per) => {
    return per.trang_thai == 3;
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

  res.render("statictis/patientStatistic", {
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

router.get("/product", async (req, res) => {
  const query = `select ct.id_san_pham, n.ten_sanpham, sum(ct.so_luong) so_luong
    from public.chi_tiet_nhu_cau_yeu_pham ct, public.nhu_yeu_pham n where ct.id_san_pham = n.id_nhu_yeu_pham
    group by ct.id_san_pham, n.ten_sanpham
    order by so_luong desc`;

  const query1 = `select ct.id_goi_nhu_cau_yeu_pham, n.ten_goi, count(*) so_luong
    from public.chi_tiet_hoa_don ct, public.goi_nhu_yeu_pham n where ct.id_goi_nhu_cau_yeu_pham = n.id_goi_nhu_yeu_pham
    group by ct.id_goi_nhu_cau_yeu_pham, n.ten_goi
    order by so_luong desc`;

  const proDetail = await db.runQuery(query);
  const packageDetail = await db.runQuery(query1);

  const numProd = proDetail.reduce((sum, item) => sum + parseInt(item.so_luong), 0);
  const numPack = packageDetail.reduce((sum, item) => sum + parseInt(item.so_luong), 0);

  res.render("statictis/productStatistic", {
    timeUpdate: dateNow,
    packages: packageDetail,
    products: proDetail,
    numPackage: numPack,
    numProd: numProd,
  });
});

router.get("/payment", async (req, res) => {
  axios({
    method: "get",
    url: "",
    responseType: "json",
  })
    .then(function (response) {
      const orders = response.data;

      res.render("statictis/paymentStatistic", { orders });
    })
    .catch(function (err) {
      console.log("err /payment ", err);
    });

  // orders.forEach((order) => {
  //     order.ngay_mua = order.ngay_mua.getDate() + " / " + (order.ngay_mua.getMonth() + 1) + " / " + order.ngay_mua.getFullYear();
  // })
});

router.get("/minPayment", async (req, res) => {
  axios({
    method: "get",
    url: "",
    responseType: "json",
  })
    .then(function (response) {
      const level = response.data;

      res.render("payment/minPayment", { level });
    })
    .catch(function (err) {
      console.log("err /minPayment ", err);
    });
});

router.post("/minPayment", async (req, res) => {
  axios({
    method: "post",
    url: "",
    data: req.body,
  })
    .then(function (response) {
      res.redirect();
    })
    .catch(function (err) {
      console.log("err /minPayment ", err);
    });
});

router.get("/paymentManagement", async (req, res) => {
  res.render("payment/paymentManagement");
});

module.exports = router;
