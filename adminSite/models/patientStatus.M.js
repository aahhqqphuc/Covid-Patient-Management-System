const db = require("./db");

const tbName = "trang_thai_benh_nhan";
const idFieldName = "id_trang_thai";

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
