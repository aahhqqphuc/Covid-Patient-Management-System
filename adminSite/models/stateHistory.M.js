const db = require("./db");
const tbName = "trang_thai_benh_nhan";
const idFieldName = "id_benh_nhan";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
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
    var query = `SELECT tt.ten_trang_thai
      FROM public.trang_thai_benh_nhan ttbn
      join public.trang_thai tt on ttbn.trang_thai = tt.id_trang_thai
      where ttbn.id_benh_nhan = ${id} and ttbn.status = 1`;

    const res = await db.getSingleResut(query);
    return res;
  },

  edit: async (id) => {
    var query = `update public.trang_thai_benh_nhan
    set status = 0
    where id_benh_nhan = ${id} and status = 1`;
    const res = await db.runQuery(query);
    return res;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },
};
