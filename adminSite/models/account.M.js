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
  changePwd: async (userId, pwd) => {
    var query = `update tai_khoan set password = '${pwd}' where user_name = '${userId}'`;

    return await db.runQuery(query);
  },
};
