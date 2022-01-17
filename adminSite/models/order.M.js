const db = require("./db");

const tbName = "hoa_don";
const idFieldName = "id_hoa_don";

const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date+' '+time;

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },

  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  },

  add: async (order)=>{
    const query = `INSERT INTO ${tbName}
    VALUES(default,'${order.id_nguoi_mua}',${order.total},'${dateTime}',${order.trang_thai}, '${dateTime}', '${dateTime}') returning id_hoa_don`;
    try {
      const rs = await db.runQuery(query);
      return rs[0];
    } catch (error) {
      console.log("error order/add :", error);
    }
  },

  updateStatus: async (trang_thai, id) => {
    const query = `Update ${tbName}
    set trang_thai = '${trang_thai}', ngay_cap_nhat = '${ngay_cap_nhat}' where id_hoa_don = '${id}' returning *`;
    try {
      const rs = await db.runQuery(query);
      return rs;
    } catch (error) {
      console.log("error order/updateStatus :", error);
    }
  },

  getOrderProductDetail : async (timeLine) => {
    let query = `select ct.id_san_pham, n.ten_sanpham, sum(ct.so_luong) so_luong
    from public.${tbName} h, public.chi_tiet_nhu_cau_yeu_pham ct, public.chi_tiet_hoa_don cthd, public.nhu_yeu_pham n where ct.id_san_pham = n.id_nhu_yeu_pham and ct.id_chi_tiet_hoa_don = cthd.id_chi_tiet and h.id_hoa_don = cthd.id_hoa_don and h.trang_thai = 1`

    if(timeLine == 'today'){
      query += ` and ngay_mua::date = now()::date`
    }
    else if(timeLine == 'this-month'){
      query += ` and date_part('month', ngay_mua) = date_part('month', CURRENT_DATE)`;
    }
    else if(timeLine == 'this-year'){
      query += ` and date_part('year', ngay_mua) = date_part('year', CURRENT_DATE)`;
    }
    
    query += ` group by ct.id_san_pham, n.ten_sanpham
    order by so_luong desc
    Limit 10`;

    const res = await db.runQuery(query);
    return res;
  },

  getOrderPackageDetail : async (timeLine) => {
    let query = `select ct.id_goi_nhu_cau_yeu_pham, n.ten_goi, count(*) so_luong
    from public.${tbName} h, public.chi_tiet_hoa_don ct, public.goi_nhu_yeu_pham n where ct.id_goi_nhu_cau_yeu_pham = n.id_goi_nhu_yeu_pham and h.id_hoa_don = ct.id_hoa_don and h.trang_thai = 1`;

    if(timeLine == 'today'){
      query += ` and ngay_mua::date = now()::date`
    }
    else if(timeLine == 'this-month'){
      query += ` and date_part('month', ngay_mua) = date_part('month', CURRENT_DATE)`;
    }
    else if(timeLine == 'this-year'){
      query += ` and date_part('year', ngay_mua) = date_part('year', CURRENT_DATE)`;
    }
    
    query += ` group by ct.id_goi_nhu_cau_yeu_pham, n.ten_goi
    order by so_luong desc
    Limit 10`;

    const res = await db.runQuery(query);
    return res;
  },

  countOrderProductDetail : async (timeLine) => {
    let query = `select sum(ct.so_luong) so_luong
    from public.${tbName} h, public.chi_tiet_nhu_cau_yeu_pham ct, public.chi_tiet_hoa_don cthd, public.nhu_yeu_pham n where ct.id_san_pham = n.id_nhu_yeu_pham and ct.id_chi_tiet_hoa_don = cthd.id_chi_tiet and h.id_hoa_don = cthd.id_hoa_don and h.trang_thai = 1`

    if(timeLine == 'today'){
      query += ` and ngay_mua::date = now()::date`
    }
    else if(timeLine == 'this-month'){
      query += ` and date_part('month', ngay_mua) = date_part('month', CURRENT_DATE)`;
    }
    else if(timeLine == 'this-year'){
      query += ` and date_part('year', ngay_mua) = date_part('year', CURRENT_DATE)`;
    }

    const res = await db.runQuery(query);
    return res[0].so_luong || 0;
  },

  countOrderPackageDetail : async (timeLine) => {
    let query = `select count(*) so_luong
    from public.${tbName} h, public.chi_tiet_hoa_don ct, public.goi_nhu_yeu_pham n where ct.id_goi_nhu_cau_yeu_pham = n.id_goi_nhu_yeu_pham and h.id_hoa_don = ct.id_hoa_don and h.trang_thai = 1`;

    if(timeLine == 'today'){
      query += ` and ngay_mua::date = now()::date`
    }
    else if(timeLine == 'this-month'){
      query += ` and date_part('month', ngay_mua) = date_part('month', CURRENT_DATE)`;
    }
    else if(timeLine == 'this-year'){
      query += ` and date_part('year', ngay_mua) = date_part('year', CURRENT_DATE)`;
    }

    const res = await db.runQuery(query);
    return res[0].so_luong || 0;
  },
};
