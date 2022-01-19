const db = require("./db");

module.exports = {
  add: async (transaction) => {
    return await db.add(db.tableName.giao_dich, transaction);
  },
};
