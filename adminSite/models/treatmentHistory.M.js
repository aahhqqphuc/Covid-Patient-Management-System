const db = require("./db");

const tbName = "lich_su_dieu_tri";
const idFieldName = "id_lich_su_dieu_tri";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
  
  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  }
};
