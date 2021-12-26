const db = require("./db");

const tbName = "hoa_don";
const idFieldName = "id_hoa_don";

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
