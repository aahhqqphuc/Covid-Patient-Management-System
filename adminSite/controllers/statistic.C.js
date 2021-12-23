const express = require('express');
const router = express.Router();
const pStatusM = require('../models/patientStatus.M');
const patientM = require('../models/patient.M');
const treatmentHistoryM = require('../models/treatmentHistory.M');
const db = require('../models/db');

// get time
const dnow = new Date;
const dateNow = `${dnow.getDate()}/${dnow.getMonth() + 1}/${dnow.getFullYear()}`

router.get('/patient', async (req, res) => {

    const pStatus = await pStatusM.all();
    const treatmentHistory = await treatmentHistoryM.all();

    const pStatusNow = pStatus.filter((per) => { return per.ngay_cap_nhat.toString().includes(dateNow) })

    const pf0 = pStatus.filter((per) => { return per.trang_thai_moi == 0 })
    const pf1 = pStatus.filter((per) => { return per.trang_thai_moi == 1 })
    const pf2 = pStatus.filter((per) => { return per.trang_thai_moi == 2 })
    const pf3 = pStatus.filter((per) => { return per.trang_thai_moi == 3 })
    const pCured = pStatusNow.filter((per) => { return per.trang_thai_moi == -1 })
    const pMove = treatmentHistory.filter((per) => { return per.ngay_cap_nhat.toString().includes(dateNow) })
    const totalCured = pStatus.filter((per) => { return per.trang_thai_moi == -1 })

    res.render('patientStatistic', {
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
})

router.get('/product', async (req, res) => {
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

    res.render('productStatistic', {
        timeUpdate: dateNow,
        packages: packageDetail,
        products: proDetail,
        numPackage: numPack,
        numProd: numProd,
    });
})

router.get('/payment', async (req, res) => {
    const query = `SELECT hd.*, bn.ho_ten, bn.du_no FROM public.hoa_don hd, public.benh_nhan_covid bn
    where bn.id_benh_nhan = hd.id_nguoi_mua`;

    const orders = await db.runQuery(query);

    orders.forEach((order) => {
        order.ngay_mua = order.ngay_mua.getDate() + " / " + (order.ngay_mua.getMonth() + 1) + " / " + order.ngay_mua.getFullYear();
    })

    res.render('paymentStatistic', {
        order: orders
    });
})

router.get('/paymentAcc', async (req, res) => {
    

    res.render('minPay', {
        payAcc: payAccs
    });
})

router.post('/paymentAcc/edit/:idAcc', async (req, res) => {
    const newMinPay = req.body.newMinPay;
    console.log(req.params.idAcc, newMinPay);
    res.redirect('../../paymentAcc')
})

module.exports = router;

