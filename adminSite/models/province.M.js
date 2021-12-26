const db = require("./db");
const tbName = "tinh";
const idFieldName = "id_tinh";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res.length > 0 ? res : null;
  },

  get: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res.length > 0 ? res[0] : null;
  },

  add: async (province) => {
    const res = await db.add(tbName, province);
    return res;
  },

  edit: async (province) => {
    const res = await db.edit(tbName, idFieldName, province);
    return res;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },
};
