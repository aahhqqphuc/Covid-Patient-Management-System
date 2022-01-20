const express = require("express");
const router = express.Router();
const orderM = require("../models/order.M");
const packageM = require("../models/package.M");
const notifyM = require("../models/notify.M");
const { compare } = require("../utils/account");
const accountM = require("../models/account.M");

const axios = require("axios");

router.get("/manage", async (req, res) => {
  axios({
    method: "get",
    url: "http://127.0.0.1:3000/payment-system/payment-account",
    responseType: "json",
    headers: { Authorization: `Bearer ${req.cookies.jwt}` },
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
    url: "http://127.0.0.1:3001/payment/limit",
    responseType: "json",
    headers: { Authorization: `Bearer ${req.cookies.jwt}` },
  })
    .then(function (response) {
      const level = response.data;

      res.render("payment/minPayment", {
        layout: "managerLayout",
        level: level.han_muc,
      });
    })
    .catch(function (err) {
      console.log("payment/min-payment/get", err);

      let info;
      if (err.response.status == "401") {
        info = "Lỗi xác thực";
      } else {
        info = "Lỗi hệ thống";
      }

      res.render("payment/minPayment", {
        layout: "managerLayout",
        info,
      });
    });
});

router.post("/min-payment", async (req, res) => {
  axios({
    method: "put",
    url: "http://127.0.0.1:3001/payment/limit",
    data: {
      phan_tram_han_muc: req.body.minPercent,
      so_tien_thanh_toan_toi_thieu: req.body.minMoney,
    },
    headers: { Authorization: `Bearer ${req.cookies.jwt}` },
  })
    .then(function (response) {
      if (response.status == "200") {
        req.flash("success", "Cập nhật thành công.");
        res.redirect("/payment/min-payment");
      } else {
        req.flash("error", "Cập nhật không thành công.");
        res.redirect("/payment/min-payment");
      }
    })
    .catch(function (err) {
      console.log("payment/min-payment/post", err);
      if (err.response.status == "401") {
        req.flash("info", "Lỗi xác thực.");
      } else {
        req.flash("error", "Cập nhật không thành công.");
      }
      return res.redirect("/payment/min-payment");
    });
});

router.post("/purchase", async (req, res) => {
  try {
    const packageId = req.body.packageId;
    const productQuantity = req.body.product;
    const opt = req.body.paymentOpt;

    const package = await packageM.get(packageId);

    for (let p of productQuantity) {
      if (p > package.gioi_han_san_pham) {
        return res.redirect("/");
      }
    }

    // Lấy chi tiết ds sản phẩm trong gói
    const packageProducts = await packageM.get_package_product(packageId);

    // tính tổng tiền
    const amount = packageProducts.reduce((sum, item, index) => sum + item.gia_tien * productQuantity[index], 0);

    // tạo hóa đơn
    const order = {
      id_nguoi_mua: res.user.patientID,
      total: null,
      trang_thai: 1,
    };

    axios({
      method: "post",
      url: "http://127.0.0.1:3001/payment-account/payment",
      data: amount,
    })
      .then(async function (response) {
        // thêm vào hóa đơn
        const orderId = await orderM.add(order);
        // Tạo chi tiết hóa đơn
        const orderDetail = {
          id_hoa_don: orderId.id_hoa_don,
          id_goi_nhu_cau_yeu_pham: packageId,
          total: amount,
        };
        // thêm vào chi tiết hóa đơn
        const orderDetailId = await orderM.addOrderDetail(orderDetail);
        // tạo chi tiết nhu cầu yếu phẩm
        for (let i in packageProducts) {
          if (productQuantity[i] != 0) {
            let packageDetail = {
              id_chi_tiet_hoa_don: orderDetailId.id_chi_tiet,
              id_san_pham: packageProducts[i].id_nhu_yeu_pham,
              so_luong: productQuantity[i],
              don_gia: packageProducts[i].gia_tien,
            };
            // thêm vào chi tiết nhu cầu yếu phẩm
            const re = await packageM.addPackageDetail(packageDetail);
          }
        }
        res.redirect("/product-package");
      })
      .catch(async function (err) {
        console.log("paying", err);
      });
  } catch (error) {
    console.log("puchase", error);
    res.status(404);
  }
});

router.get("/payment-debt", async (req, res) => {
  // call API
  try {
    const level = await axios.get(`http://127.0.0.1:3001/payment/limit`, { headers: { Authorization: `Bearer ${req.cookies.jwt}` } });
    const debt = await axios.get(`http://127.0.0.1:3001/payment/payment-account/debt`, { headers: { Authorization: `Bearer ${req.cookies.jwt}` } });
    const accountBalance = await axios.get(`http://127.0.0.1:3001/payment/payment-account/balance`, { headers: { Authorization: `Bearer ${req.cookies.jwt}` } });

    const so_du = parseInt(accountBalance.data.so_du);
    const du_no = parseInt(debt.data.du_no);
    const phan_tram = parseInt(level.data.han_muc.phan_tram_han_muc) / 100;
    const tien_toi_thieu = parseInt(level.data.han_muc.o_tien_thanh_toan_toi_thieu);

    let from = du_no * phan_tram,
      to = du_no;

    if (du_no < tien_toi_thieu || du_no * phan_tram < tien_toi_thieu || du_no - du_no * phan_tram < tien_toi_thieu) {
      from = du_no;
      to = du_no;
    }

    let isEqual = from == to ? 0 : 1;

    const dataPay = {
      moneyAvailable: so_du,
      debt: du_no,
      from,
      to,
      isEqual,
    };

    res.render("payment/debtPayment", {
      layout: "managerLayout",
      dataPay,
    });
  } catch (error) {
    return res.render("payment/debtPayment", {
      layout: "managerLayout",
      error: "Lỗi hệ thống",
    });
  }
});

router.post("/payment-debt", async (req, res) => {
  const password = req.body.password;
  const amount = req.body.paymentAmount;

  const user = await accountM.findByUsername(req.user.username);
  const validPass = await compare(password, user[0].password);

  if (!validPass) {
    req.flash("error", "Mật khẩu không đúng");
    return res.redirect("/payment/payment-debt");
  }

  axios({
    method: "post",
    url: "http://127.0.0.1:3001/payment/payment-account/debt",
    data: amount,
    headers: { Authorization: `Bearer ${req.cookies.jwt}` }
  })
    .then(function (response) {
       req.flash('success', 'Thanh toán thành công.')
       res.redirect('/payment/payment-debt');
    })
    .catch(function (err) {
      req.flash('error', 'Thanh toán không thành công.')
      res.redirect('/payment/payment-debt');
    });
});

router.get("/notify/:id", async (req, res) => {
  const noftify = {
    ID_Benh_Nhan: req.params.id,
    Thong_Bao: `Vui lòng thanh toán dư nợ của bạn`,
    status: 0,
  };
  try {
    await notifyM.add(noftify);
    res.redirect("/payment/manage");
  } catch (error) {
    res.redirect("/payment/manage");
  }
});

module.exports = router;
