const db = require("./db");

module.exports = {
  add: async (noftify) => {
    const res = await db.add(db.tableName.thong_bao, noftify);
    return res;
  },
  get: async (userId) => {
    const query = `select * from thong_bao where id_benh_nhan = ${userId}`;
    try {
        const res = await db.any(query);
        return res;
    } catch (error) {
        console.log("err noftify/get", error);
    }
  },
};
