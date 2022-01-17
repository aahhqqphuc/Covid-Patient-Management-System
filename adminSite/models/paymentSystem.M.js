const db = require("./db");

module.exports = {
  getLevel: async () => {
    const res = await db.load("han_muc");
    return res;
  },

  updateLevel: async (level) => {
    const query = `UPDATE public.han_muc set phan_tram_han_muc = ${level.minPercent}, so_tien_thanh_toan_toi_thieu = ${level.minMoney} returning *`;
    const res = await db.runQuery(query);
    return res[0];
  },

  getPaymentAccount: async () => {
    const query = `SELECT * FROM public.tai_khoan_thanh_toan
    ORDER BY id_tai_khoan ASC `;
    const res = await db.runQuery(query);
    return res;
  },
};
