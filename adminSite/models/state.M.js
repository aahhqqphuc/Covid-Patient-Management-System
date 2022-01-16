const db = require("./db");
const tbName = "trang_thai_benh_nhan";
const idFieldName = "id_trang_thai";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },

  get: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res;
  },

  add: async (state) => {
    const res = await db.add(tbName, state);
    return res;
  },

  edit: async (state) => {
    const res = await db.edit(tbName, idFieldName, state);
    return res;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },
};
