const db = require("./db");

const tbName = "Hoa_Don";
const idFieldName = "ID_Hoa_Don";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
};
