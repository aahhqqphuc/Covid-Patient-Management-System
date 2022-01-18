const db = require("./db");

module.exports = {
  add: async (user) => {
    const res = await db.add(db.tableName.tai_khoan, user);
    return res;
  },
  findByUsername: async (username) => {
    const res = await db.get(db.tableName.tai_khoan, "user_name", username);
    return res;
  },
};
