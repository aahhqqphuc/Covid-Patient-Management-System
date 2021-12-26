const db = require("./db");
const tbName = "lich_su_trang_thai_benh_nhan";
const idFieldName = "id_benh_nhan";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res.length > 0 ? res : null;
  },

  get: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res.length > 0 ? res[0] : null;
  },

  add: async (stateHistory) => {
    const res = await db.add(tbName, stateHistory);
    return res;
  },

  edit: async (stateHistory) => {
    const res = await db.edit(tbName, idFieldName, stateHistory);
    return res;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },
};
