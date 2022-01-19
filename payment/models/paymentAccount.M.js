const db = require("./db");
const id_tai_khoan_chinh = 1;

module.exports = {
  getBalance: async (userId) => {
    var query = `SELECT so_du
        FROM public.${db.tableName.tai_khoan_thanh_toan} where id_benh_nhan = ${userId};`;

    return await db.getSingleResut(query);
  },

  getDebt: async (userId) => {
    var query = `SELECT du_no
        FROM public.${db.tableName.tai_khoan_thanh_toan} where id_benh_nhan = ${userId};`;

    return await db.getSingleResut(query);
  },

  add: async (paymentAccount) => {
    return await db.add(db.tableName.tai_khoan_thanh_toan, paymentAccount);
  },

  deposit: async (userId, amount) => {
    var query = `update public.${db.tableName.tai_khoan_thanh_toan} set so_du = so_du + ${amount} 
      where id_benh_nhan = ${userId} returning id_tai_khoan, so_du;`;

    return await db.getSingleResut(query);
  },

  payment: async (userId, amount) => {
    var query = `update public.${db.tableName.tai_khoan_thanh_toan} set du_no = du_no + ${amount} 
      where id_benh_nhan = ${userId} returning du_no;`;

    return await db.getSingleResut(query);
  },

  getState: async (userId) => {
    var query = `SELECT trang_thai
    FROM public.${db.tableName.tai_khoan_thanh_toan} where id_benh_nhan = ${userId};`;

    return await db.getSingleResut(query);
  },

  setState: async (userId, state) => {
    var query = `update public.${db.tableName.tai_khoan_thanh_toan} set trang_thai = ${state}
    where id_benh_nhan = ${userId};`;

    return await db.getSingleResut(query);
  },

  recevie: async (amount) => {
    var query = `update public.${db.tableName.tai_khoan_thanh_toan} set so_du = so_du + ${amount} 
      where id_tai_khoan = ${id_tai_khoan_chinh} returning so_du;`;

    return await db.getSingleResut(query);
  },
};
