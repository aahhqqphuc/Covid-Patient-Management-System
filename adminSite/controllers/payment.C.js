const express = require("express");
const router = express.Router();
const orderM = require("../models/order.M");
const orderDetailM = require("../models/orderDetail.M");
const packageM = require("../models/package.M");
const packageDetailM = require("../models/packageDetail.M");

const axios = require("axios");

router.get("/manage", async (req, res) => {
  axios({
    method: "get",
    url: "http://127.0.0.1:3000/payment-system/payment-account",
    responseType: "json",
  })
    .then(function (response) {
      const paymentAccounts = response.data;

      res.render("payment/paymentManagement", {
        layout: "managerLayout",
        paymentAccounts
      });
    })
    .catch(function (err) {
      console.log("err /payment/manager", err);
    });
});

router.get("/min-payment", async (req, res) => {
  axios({
    method: "get",
    url: "http://127.0.0.1:3000/payment-system/level",
    responseType: "json",
  })
    .then(function (response) {
      const level = response.data;

      res.render("payment/minPayment", {
        layout: "managerLayout",
        level: level[0],
      });
    })
    .catch(function (err) {
      console.log("payment/min-payment/get", err);
    });
});

router.post("/min-payment", async (req, res) => {
  axios({
    method: "POST",
    url: "http://127.0.0.1:3000/payment-system/level",
    data: req.body,
  })
    .then(function (response) {
      if(response.data.status == 'success'){
        req.flash('success', 'success')
        res.redirect('/payment/min-payment')
      }else{
        req.flash('error', 'error')
        res.redirect('/payment/min-payment')
      }
    })
    .catch(function (err) {
      console.log("payment/min-payment/post", err);
    });
});

router.post("/purchase", async (req, res) => {
  try {

    const packageId = req.body.packageId;
    const productQuantity = req.body.product;
    const opt = req.body.paymentOpt;

    const package = await packageM.get(packageId);

    for (let p of productQuantity) {
      if (p > package.muc_gioi_han_san_pham) {
        return res.redirect('/');
      }
    }

    // Lấy chi tiết ds sản phẩm trong gói
    const packageProducts = await packageM.get_package_product(packageId);

    const order = {
      // id_nguoi_mua: req.user.id_tai_khoan,
      id_nguoi_mua: 1,
      total: null,
      trang_thai: 1,
    }
    // thêm vào hóa đơn
    const orderId = await orderM.add(order);

    // tính tổng tiền
    const total = packageProducts.reduce((sum, item, index) => sum + item.gia_tien * productQuantity[index], 0);

    const orderDetail = {
      id_hoa_don: orderId.id_hoa_don,
      id_goi_nhu_cau_yeu_pham: packageId,
      total: total
    }
    // thêm vào chi tiết hóa đơn
    const orderDetailId = await orderDetailM.add(orderDetail);

    for (let i in packageProducts) {
      if(productQuantity[i] != 0){
        let packageDetail = {
          id_chi_tiet_hoa_don: orderDetailId.id_chi_tiet,
          id_san_pham: packageProducts[i].id_nhu_yeu_pham,
          so_luong: productQuantity[i],
          don_gia: packageProducts[i].gia_tien
        }
        
        //  thêm vào chi tiết nhu cầu yếu phẩm
        const re = await packageDetailM.add(packageDetail);
      }
    }

    // const pay = {
    //   money: total,
    //   options: opt
    // }

    // axios({
    //   method: "post",
    //   url: "",
    //   data: pay,
    // })
    //   .then(function (response) {
    //     res.redirect('/payment/min-payment');
    //   })
    //   .catch(function (err) {
    //     const status = 0;
    //     orderM.updateStatus(status, orderId.id_hoa_don)
    //     console.log("paying", err);
    //   });
  } catch (error) {
    console.log("puchase", error);
  }
});

module.exports = router;
