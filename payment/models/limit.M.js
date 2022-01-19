const db = require("./db");

module.exports = {
  getLimit: async () => {
    var query = `SELECT phan_tram_han_muc, so_tien_thanh_toan_toi_thieu
      FROM public.${db.tableName.han_muc} limit 1;`;

    return await db.getSingleResut(query);
  },

  changeLimit: async (newLimit) => {
    var query = `UPDATE public.${db.tableName.han_muc} SET phan_tram_han_muc = ${newLimit};`;

    return await db.update(query);
  },
};
