const db = require("./db");

const tbName = "tai_khoan";
const idFieldName = "id_tai_khoan";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
};
