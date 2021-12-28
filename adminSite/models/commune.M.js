const db = require("./db");
const tbName = "xa";
const idFieldName = "id_xa";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res.length > 0 ? res : null;
  },

  get: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res.length > 0 ? res[0] : null;
  },

  getByDistrict: async (id) => {
    const res = await db.get(tbName, "id_huyen", id);
    return res.length > 0 ? res : null;
  },

  add: async (district) => {
    const res = await db.add(tbName, district);
    return res;
  },

  edit: async (district) => {
    const res = await db.edit(tbName, idFieldName, district);
    return res;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },
};
