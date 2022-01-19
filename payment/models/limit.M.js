const db = require("./db");

module.exports = {
  getLimit: async () => {
    var query = `SELECT phan_tram_han_muc
      FROM public.${db.tableName.han_muc} limit 1;`;

    const res = await db.getSingleResut(query);
    return res;
  },

  changeLimit: async (newLimit) => {
    var query = `UPDATE public.${db.tableName.han_muc} SET phan_tram_han_muc = ${newLimit}`;

    const res = await db.update(query);
    return res;
  },
};
