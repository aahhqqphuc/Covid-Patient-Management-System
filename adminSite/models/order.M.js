const db = require("./db");

const tbNameOrder = "hoa_don";
const idFieldNameOrder = "id_hoa_don";
const tbNameOrderDetail = "chi_tiet_hoa_don";
const idFieldNameOrderDetail = "id_chi_tiet";

const today = new Date();
const date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date + " " + time;

module.exports = {
  all: async () => {
    const res = await db.load(tbNameOrder);
    return res;
  },

  get: async (fieldName, value) => {
    const res = await db.get(tbNameOrder, fieldName, value);
    return res;
  },

  add: async (order) => {
    const query = `INSERT INTO ${tbNameOrder}
    VALUES(default,'${order.id_nguoi_mua}',${order.total},'${dateTime}',${order.trang_thai}, '${dateTime}', '${dateTime}') returning id_hoa_don`;
    try {
      const rs = await db.runQuery(query);
      return rs[0];
    } catch (error) {
      console.log("error order/add :", error);
    }
  },

  updateStatus: async (trang_thai, id) => {
    const query = `Update ${tbNameOrder}
    set trang_thai = '${trang_thai}', ngay_cap_nhat = '${ngay_cap_nhat}' where id_hoa_don = '${id}' returning *`;
    try {
      const rs = await db.runQuery(query);
      return rs;
    } catch (error) {
      console.log("error order/updateStatus :", error);
    }
  },

  getOrderProductDetail: async (timeLine) => {
    let query = `select ct.id_san_pham, n.ten_sanpham, sum(ct.so_luong) so_luong
    from public.${tbNameOrder} h, public.chi_tiet_nhu_cau_yeu_pham ct, public.chi_tiet_hoa_don cthd, public.nhu_yeu_pham n where ct.id_san_pham = n.id_nhu_yeu_pham and ct.id_chi_tiet_hoa_don = cthd.id_chi_tiet and h.id_hoa_don = cthd.id_hoa_don and h.trang_thai = 1`;

    if (timeLine == "today") {
      query += ` and ngay_mua::date = now()::date`;
    } else if (timeLine == "this-month") {
      query += ` and date_part('month', ngay_mua) = date_part('month', CURRENT_DATE)`;
    } else if (timeLine == "this-year") {
      query += ` and date_part('year', ngay_mua) = date_part('year', CURRENT_DATE)`;
    }

    query += ` group by ct.id_san_pham, n.ten_sanpham
    order by so_luong desc
    Limit 10`;

    const res = await db.runQuery(query);
    return res;
  },

  getOrderPackageDetail: async (timeLine) => {
    let query = `select ct.id_goi_nhu_cau_yeu_pham, n.ten_goi, count(*) so_luong
    from public.${tbNameOrder} h, public.chi_tiet_hoa_don ct, public.goi_nhu_yeu_pham n where ct.id_goi_nhu_cau_yeu_pham = n.id_goi_nhu_yeu_pham and h.id_hoa_don = ct.id_hoa_don and h.trang_thai = 1`;

    if (timeLine == "today") {
      query += ` and ngay_mua::date = now()::date`;
    } else if (timeLine == "this-month") {
      query += ` and date_part('month', ngay_mua) = date_part('month', CURRENT_DATE)`;
    } else if (timeLine == "this-year") {
      query += ` and date_part('year', ngay_mua) = date_part('year', CURRENT_DATE)`;
    }

    query += ` group by ct.id_goi_nhu_cau_yeu_pham, n.ten_goi
    order by so_luong desc
    Limit 10`;

    const res = await db.runQuery(query);
    return res;
  },

  countOrderProductDetail: async (timeLine) => {
    let query = `select sum(ct.so_luong) so_luong
    from public.${tbNameOrder} h, public.chi_tiet_nhu_cau_yeu_pham ct, public.chi_tiet_hoa_don cthd, public.nhu_yeu_pham n where ct.id_san_pham = n.id_nhu_yeu_pham and ct.id_chi_tiet_hoa_don = cthd.id_chi_tiet and h.id_hoa_don = cthd.id_hoa_don and h.trang_thai = 1`;

    if (timeLine == "today") {
      query += ` and ngay_mua::date = now()::date`;
    } else if (timeLine == "this-month") {
      query += ` and date_part('month', ngay_mua) = date_part('month', CURRENT_DATE)`;
    } else if (timeLine == "this-year") {
      query += ` and date_part('year', ngay_mua) = date_part('year', CURRENT_DATE)`;
    }

    const res = await db.runQuery(query);
    return res[0].so_luong || 0;
  },

  countOrderPackageDetail: async (timeLine) => {
    let query = `select count(*) so_luong
    from public.${tbNameOrder} h, public.chi_tiet_hoa_don ct, public.goi_nhu_yeu_pham n where ct.id_goi_nhu_cau_yeu_pham = n.id_goi_nhu_yeu_pham and h.id_hoa_don = ct.id_hoa_don and h.trang_thai = 1`;

    if (timeLine == "today") {
      query += ` and ngay_mua::date = now()::date`;
    } else if (timeLine == "this-month") {
      query += ` and date_part('month', ngay_mua) = date_part('month', CURRENT_DATE)`;
    } else if (timeLine == "this-year") {
      query += ` and date_part('year', ngay_mua) = date_part('year', CURRENT_DATE)`;
    }

    const res = await db.runQuery(query);
    return res[0].so_luong || 0;
  },

  // ------- order detail -------------------------------------------------------------
  allOrderDetail: async () => {
    const res = await db.load(tbNameOrderDetail);
    return res;
  },

  getOrderDetail: async (fieldName, value) => {
    const res = await db.get(tbNameOrderDetail, fieldName, value);
    return res;
  },
  addOrderDetail: async (oDetail) => {
    const query = `INSERT INTO ${tbNameOrderDetail}
    VALUES(default,'${oDetail.id_hoa_don}','${oDetail.id_goi_nhu_cau_yeu_pham}',${oDetail.total}) returning id_chi_tiet;`;
    try {
      const rs = await db.runQuery(query);
      return rs[0];
    } catch (error) {
      console.log("error orderDetail/add :", error);
    }
  },
  orderHistory: async (patientId) => {
    const query = `select hd.*,p.cmnd,p.ho_ten,g.ten_goi,ct.id_chi_tiet from hoa_don hd 
    join benh_nhan_covid p on hd.id_nguoi_mua = p.id_benh_nhan
    join chi_tiet_hoa_don ct on hd.id_hoa_don = ct.id_hoa_don
    join chi_tiet_nhu_cau_yeu_pham ct2 on ct.id_chi_tiet = ct2.id_chi_tiet_hoa_don
    join goi_nhu_yeu_pham g on g.id_goi_nhu_yeu_pham = ct.id_goi_nhu_cau_yeu_pham
    where id_nguoi_mua = ${patientId} order by ngay_mua;`;
    try {
      const rs = await db.runQuery(query);
      return rs;
    } catch (error) {
      console.log("error orderDetail/add :", error);
    }
  },
  orderHistoryDetail: async (id) => {
    const q1 = `select * from chi_tiet_hoa_don ct
              join chi_tiet_nhu_cau_yeu_pham ct2 on ct.id_chi_tiet = ct2.id_chi_tiet_hoa_don
              join goi_nhu_yeu_pham g on g.id_goi_nhu_yeu_pham = ct.id_goi_nhu_cau_yeu_pham
              where id_chi_tiet_hoa_don = ${id} limit 1`;
    const query = `select distinct on (p.id_nhu_yeu_pham)p.ten_sanpham, p.id_nhu_yeu_pham,id_goi_nhu_yeu_pham,url,ten_goi,thoi_gian,
            to_string(muc_gioi_han_goi) muc_gioi_han_goi_string,so_luong,so_luong * don_gia as gia from chi_tiet_hoa_don ct
            join chi_tiet_nhu_cau_yeu_pham ct2 on ct.id_chi_tiet = ct2.id_chi_tiet_hoa_don
            join goi_nhu_yeu_pham g on g.id_goi_nhu_yeu_pham = ct.id_goi_nhu_cau_yeu_pham
			      join nhu_yeu_pham p on p.id_nhu_yeu_pham = ct2.id_san_pham
            join hinh_anh_san_pham img on p.id_nhu_yeu_pham = img.id_nhu_yeu_pham 
            where id_chi_tiet_hoa_don = ${id}`;
    try {
      const rs1 = await db.runQuery(query);
      const rs2 = await db.runQuery(q1);
      return { package: rs2, products: rs1 };
    } catch (error) {
      console.log("error orderDetail/add :", error);
    }
  },
};
