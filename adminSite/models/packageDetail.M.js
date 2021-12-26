const db = require("./db");

const tbName = "chi_tiet_nhu_cau_yeu_pham";
const idFieldName = "id_chi_tiet_nhu_cau_yeu_pham";

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
