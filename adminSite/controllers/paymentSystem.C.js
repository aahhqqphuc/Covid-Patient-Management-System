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

router.get("/package-detail/:id", async (req, res) => {
    try {
        const packageQuery = `select id_goi_nhu_yeu_pham, ten_goi, muc_gioi_han_san_pham
      from public.goi_nhu_yeu_pham where id_goi_nhu_yeu_pham = '${req.params.id}'`;
        const package = await db.runQuery(packageQuery);

        const packageProductsQuery = `select distinct on (n.id_nhu_yeu_pham) n.id_nhu_yeu_pham, n.ten_sanpham, d.so_luong, n.gia_tien, h.url
        from public.danh_sach_nhu_yeu_pham d, public.nhu_yeu_pham n left join public.hinh_anh_san_pham h on(n.id_nhu_yeu_pham = h.id_nhu_yeu_pham and h.mac_dinh = '1') where n.id_nhu_yeu_pham = d.id_sanpham and d.id_goi = '${req.params.id}'`;
        const packageProducts = await db.runQuery(packageProductsQuery);

        const data = {
            'info': package,
            'products': packageProducts
        }

        res.json(data);
    } catch (error) {
        res.status(404, error.message);
    }
});


module.exports = router;
