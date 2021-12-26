const db = require("./db");
const tbName = "benh_nhan_covid";
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

  add: async (patient) => {
    const res = await db.add(tbName, patient);
    return res;
  },

  edit: async (patient) => {
    const res = await db.edit(tbName, idFieldName, patient);
    return res;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },
};
