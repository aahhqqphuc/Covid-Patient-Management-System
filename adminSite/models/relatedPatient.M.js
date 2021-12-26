const db = require("./db");
const tbName = "nguoi_lien_quan";
const idFieldName = "id_nguoi_lien_quan";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res.length > 0 ? res : null;
  },

  get: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res.length > 0 ? res[0] : null;
  },

  add: async (relatedPatient) => {
    const res = await db.add(tbName, relatedPatient);
    return res;
  },

  edit: async (relatedPatient) => {
    const res = await db.edit(tbName, idFieldName, relatedPatient);
    return res;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },
};
