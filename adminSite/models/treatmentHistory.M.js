const db = require("./db");

const tbName = "lich_su_dieu_tri";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },

  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  },

  add: async (treatmentHistory) => {
    const res = await db.add(tbName, treatmentHistory);
    return res;
  },

  get_cur: async (id) => {
    var query = `SELECT tennoidieutri
      FROM public.lich_su_dieu_tri ls
      join public.noi_dieu_tri ndt on ls.mavitri = ndt.mavitri
      where ls.id_benh_nhan = ${id} and ls.status = 1`;
    const res = await db.getSingleResut(query);
    return res;
  },

  edit: async (id) => {
    var query = `update public.lich_su_dieu_tri
      set status = 0, ngay_di_chuyen = CURRENT_DATE, ngay_cap_nhat = CURRENT_DATE
      where id_benh_nhan = ${id} and status = 1`;
    const res = await db.runQuery(query);
    return res;
  },
};
