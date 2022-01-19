const db = require("./db");

module.exports = {
  getLimit: async () => {
    var query = `SELECT phan_tram_han_muc, so_tien_thanh_toan_toi_thieu
      FROM public.${db.tableName.han_muc} limit 1;`;

    const res = await db.getSingleResut(query);
    return res;
  },

  changeLimit: async (newLimit) => {
    var query = `UPDATE public.${db.tableName.han_muc} SET phan_tram_han_muc = ${newLimit.phan_tram_han_muc}, so_tien_thanh_toan_toi_thieu = ${newLimit.so_tien_thanh_toan_toi_thieu}`;
    const res = await db.update(query);
    return res;
  },
};
