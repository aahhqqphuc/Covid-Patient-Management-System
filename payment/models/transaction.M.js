const db = require("./db");

module.exports = {
  add: async (transaction) => {
    return await db.add(db.tableName.giao_dich, transaction);
  },

  getTransactionHistory: async (userId) => {
    var query = `select gd.ngay_giao_dich, gd.so_tien 
      from public.${db.tableName.giao_dich} gd join public.${db.tableName.tai_khoan_thanh_toan} tk
      on gd.id_tai_khoan_gui = tk.id_tai_khoan
      where tk.id_benh_nhan = ${userId} order by gd.ngay_giao_dich asc;`;

    return await db.runQuery(query);
  },
};
