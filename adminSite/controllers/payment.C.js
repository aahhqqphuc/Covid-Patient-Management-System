const express = require("express");
const router = express.Router();
const orderM = require("../models/order.M");
const packageM = require("../models/package.M");
const notifyM = require("../models/notify.M");

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
        paymentAccounts,
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
    headers: {
      Authorization: "Bearer",
    },
  })
    .then(function (response) {
      if (response.data.status == "success") {
        res.redirect("/payment/min-payment");
      } else {
        res.redirect("/payment/min-payment");
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

    const package = await packageM.get(packageId);

    for (let p of productQuantity) {
      if (p > package.muc_gioi_han_san_pham) {
        return res.redirect("/");
      }
    }

    // Lấy chi tiết ds sản phẩm trong gói
    const packageProducts = await packageM.get_package_product(packageId);

    const order = {
      // id_nguoi_mua: req.user.id_tai_khoan,
      id_nguoi_mua: 1,
      total: null,
      trang_thai: 1,
    };
    // thêm vào hóa đơn
    const orderId = await orderM.add(order);

    // tính tổng tiền
    const total = packageProducts.reduce((sum, item, index) => sum + item.gia_tien * productQuantity[index], 0);

    const orderDetail = {
      id_hoa_don: orderId.id_hoa_don,
      id_goi_nhu_cau_yeu_pham: packageId,
      total: total,
    };
    // thêm vào chi tiết hóa đơn
    const orderDetailId = await orderM.addOrderDetail(orderDetail);

    for (let i in packageProducts) {
      if (productQuantity[i] != 0) {
        let packageDetail = {
          id_chi_tiet_hoa_don: orderDetailId.id_chi_tiet,
          id_san_pham: packageProducts[i].id_nhu_yeu_pham,
          so_luong: productQuantity[i],
          don_gia: packageProducts[i].gia_tien,
        };

        //  thêm vào chi tiết nhu cầu yếu phẩm
        const re = await packageM.addPackageDetail(packageDetail);
      }
    }

    // axios({
    //   method: "post",
    //   url: "",
    //   data: total,
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

router.get("/notify/:id", async (req, res) => {
  const id = req.params.id;
  const noftify = {
    id_benh_nhan: id,
    noi_dung: `Vui lòng thanh toán dư nợ của bạn`,
    trang_thai: 0,
    ngay_tao: new Date(),
  };
  try {
    await notifyM.add(noftify);
    res.redirect("/payment/manage");
  } catch (error) {
    res.redirect("/payment/manage");
  }
});

module.exports = router;
