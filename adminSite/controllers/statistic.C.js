const express = require('express');
const router = express.Router();
const pStatusM = require('../models/patientStatus.M');
const orderDetailM = require('../models/orderDetail.M');
// const packageDetailM = require('../models/packageDetail.M');
const orderM = require('../models/order.M');
const patientM = require('../models/patient.M');
const treatmentHistoryM = require('../models/treatmentHistory.M');

router.get('/patient', async (req, res) => {
    const dnow = new Date;
    const dateNow = `${dnow.getDate()}/${dnow.getMonth() + 1}/${dnow.getFullYear()}`

    const pStatus = await pStatusM.all();
    const treatmentHistory = await treatmentHistoryM.all();

    const pStatusNow = pStatus.filter((per) => { return per.ngay_cap_nhat.toString().includes(dateNow) })

    const pf0 = pStatus.filter((per) => { return per.trang_thai_moi == 'F0' })
    const pf1 = pStatus.filter((per) => { return per.trang_thai_moi == 'F1' })
    const pf2 = pStatus.filter((per) => { return per.trang_thai_moi == 'F2' })
    const pf3 = pStatus.filter((per) => { return per.trang_thai_moi == 'F3' })
    const pCured = pStatusNow.filter((per) => { return per.trang_thai_moi == 'Đã khỏi bệnh' })
    const pMove = treatmentHistory.filter((per) => { return per.ngay_cap_nhat.toString().includes(dateNow) })
    const totalCured = pStatus.filter((per) => { return per.trang_thai_moi == 'Đã khỏi bệnh' })

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

// router.get('/product', async (req, res) => {
//     const orderDetail = await orderDetailM.all();
//     const packageDetail = await packageDetailM.all();

//     const numProd = packageDetail.reduce((sum, item) => sum + item.so_luong, 0);

//     res.render('productStatistic', {
//         numPackage: orderDetail.length,
//         numProd: numProd,
//     });
// })

// router.get('/payment', async (req, res) => {
//     const orderPaid = await orderM.get("trang_thai", "1");

//     const order = [];

//     orderPaid.forEach(async e => {
//         let p = await patientM.get("id_benh_nhan", e.id_nguoi_mua);

//         const pNew = {
//             'idOrder': e.id_hoa_don,
//             'buyer': p[0].ho_ten,
//             'date': e.ngay_mua,
//             'debt': p[0].du_no,
//             'status': e.trang_thai,
//         };

//         order.push(pNew);
//     });

//     console.log(order);

//     res.render('paymentStatistic', {
//         order: order
//     });
// })

module.exports = router;

