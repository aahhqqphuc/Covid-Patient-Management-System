const db = require("./db");

const tbName = "noi_dieu_tri";
const idFieldName = "mavitri";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },

  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  },
};
