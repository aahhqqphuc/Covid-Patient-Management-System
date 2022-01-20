const db = require("./db");

module.exports = {
  add: async (user) => {
    return (res = await db.add(db.tableName.tai_khoan, user));
  },
  findByUsername: async (username) => {
    return (res = await db.get(db.tableName.tai_khoan, "user_name", username));
  },
  findAdmin: async () => {
    return (res = await db.get(db.tableName.tai_khoan, "role", "admin"));
  },
};
