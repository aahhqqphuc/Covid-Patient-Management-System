const db = require("./db");

const tbName = "hoa_don";
const idFieldName = "ID_Hoa_Don";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
};
