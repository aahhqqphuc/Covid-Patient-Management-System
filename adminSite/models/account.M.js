const db = require("./db");

module.exports = {
  add: async (user) => {
    const res = await db.add(db.tableName.tai_khoan, user);
    return res;
  },
};
