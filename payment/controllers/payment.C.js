const express = require("express");
const router = express.Router();
const limitM = require("../models/limit.M");
const paymentAccountM = require("../models/paymentAccount.M");
const transactionM = require("../models/transaction.M");
const { auth } = require("../utils/auth");

router.post("/add", auth, async (req, res) => {
  if (req.user.role != "manager") {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }

  let paymentAccount = {
    so_du: 0,
    du_no: 0,
    id_benh_nhan: req.body.patientId,
    ngay_giao_dich_gan_nhat: new Date(),
    trang_thai: 1,
  };

  await paymentAccountM.add(paymentAccount);

  res.status(200).json({
    msg: "success",
  });
});

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
  if (req.user.role != "manager") {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }
  const result = await limitM.changeLimit(req.body);
  res.status(200).json({
    msg: "success",
    result: result,
  });
});

// get số dư
router.get("/payment-account/balance", auth, async (req, res) => {
  if (req.user.patientId == null) {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }

  const result = await paymentAccountM.getBalance(req.user.patientId);

  res.status(200).json({
    msg: "success",
    so_du: result.so_du,
  });
});

// get dư nợ
router.get("/payment-account/debt", auth, async (req, res) => {
  if (req.user.patientId == null) {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }

  const result = await paymentAccountM.getDebt(req.user.patientId);

  res.status(200).json({
    msg: "success",
    du_no: result.du_no,
  });
});

// nạp tiền
router.post("/payment-account/deposit", auth, async (req, res) => {
  if (req.user.patientId == null) {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }

  const result = await paymentAccountM.deposit(req.user.patientId, req.body.amount);

  res.status(200).json({
    msg: "success",
    so_du: result.so_du,
  });
});

// thanh toán hóa đơn
router.post("/payment-account/payment", auth, async (req, res) => {
  if (req.user.patientId == null) {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }

  const state = await paymentAccountM.getState(req.user.patientId);
  if (state.trang_thai == 0) {
    return res.status(400).json({
      msg: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản lý để mở khóa.",
    });
  }

  const result = await paymentAccountM.payment(req.user.patientId, req.body.amount);

  res.status(200).json({
    msg: "success",
    du_no: result.du_no,
  });
});

// trả nợ
router.post("/payment-account/pay", auth, async (req, res) => {
  if (req.user.patientId == null) {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }

  const cur_balance = await paymentAccountM.getBalance(req.user.patientId);

  if (cur_balance.so_du < req.body.amount) {
    return res.status(400).json({
      msg: "Số dư trong tài khoản không đủ để thực hiện yêu cầu",
    });
  }

  const result_balance = await paymentAccountM.deposit(req.user.patientId, -req.body.amount);

  const result_debt = await paymentAccountM.payment(req.user.patientId, -req.body.amount);

  await paymentAccountM.recevie(req.body.amount);

  let transaction = {
    id_tai_khoan_gui: result_balance.id_tai_khoan,
    ngay_giao_dich: new Date(),
    so_tien: req.body.amount,
  };

  await transactionM.add(transaction);

  res.status(200).json({
    msg: "success",
    so_du: result_balance.so_du,
    du_no: result_debt.du_no,
  });
});

// get list bệnh nhân hơn 30 ngày chưa trả nợ
router.get("/debt-patient", auth, async (req, res) => {
  if (req.user.role != "manager") {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }
  const result = await paymentAccountM.getDebtPatient(req.body.time);

  res.status(200).json({
    msg: "success",
    danh_sach: result,
  });
});

// khóa tài khoản / mở khóa tài khoản
router.put("/change-state", auth, async (req, res) => {
  if (req.user.role != "manager") {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }

  await paymentAccountM.setState(req.user.patientId, req.body.state);

  res.status(200).json({
    msg: "success",
  });
});

// get lịch sử giao dịch
router.get("/transaction-history", auth, async (req, res) => {
  if (req.user.patientId == null) {
    return res.status(401).json({
      msg: "unauthorized",
    });
  }

  const result = await transactionM.getTransactionHistory(req.user.patientId);

  res.status(200).json({
    msg: "success",
    giao_dich: result,
  });
});

module.exports = router;
