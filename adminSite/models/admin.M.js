const db = require("./db");

module.exports = {
  all: async () => {
    const res = await db.load(db.tableName.tai_khoan);
    return res;
  },
};
