const db = require("./db");
const tbName = "lich_su_trang_thai_benh_nhan";
const idFieldName = "id_benh_nhan";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res.length > 0 ? res : null;
  },

  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  },

  add: async (stateHistory) => {
    const res = await db.add(tbName, stateHistory);
    return res;
  },

  get_cur: async (id) => {
    var query = `SELECT tt.trang_thai
    FROM public.lich_su_trang_thai_benh_nhan ls
    join public.trang_thai tt on ls.id_trang_thai = tt.id_trang_thai
    where ls.id_benh_nhan = ${id} and ls.status = 1`;

    const res = await db.runQuery(query);
    return res.length > 0 ? res[0] : null;
  },

  edit: async (id) => {
    console.log("fd");
    var query = `update public.lich_su_trang_thai_benh_nhan
    set status = 0
    where id_benh_nhan = ${id} and status = 1`;
    const res = await db.runQuery(query);
    return res.length > 0 ? res[0] : null;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },
};
