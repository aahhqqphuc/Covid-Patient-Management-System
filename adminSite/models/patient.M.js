const db = require("./db");

const tbName = "benh_nhan_covid";
const idFieldName = "id_benh_nhan";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
};
