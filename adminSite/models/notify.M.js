const db = require("./db");

module.exports = {
  add: async (noftify) => {
    const query = `insert into thong_bao values(default, '${noftify.id_benh_nhan}', '${noftify.thong_bao}', 0)`;
    try {
      const res = await db.runQuery(query);
      return res;
    } catch (error) {
      console.log("err noftify/get", error);
    }
  },
  get: async (userId) => {
    const query = `select * from thong_bao where id_benh_nhan = ${userId}`;
    try {
      const res = await db.runQuery(query);
      return res;
    } catch (error) {
      console.log("err noftify/get", error);
    }
  },
  read: async (id) => {
    const query = `update thong_bao set status = 1 where id_thong_bao = ${id};`;
    try {
      const res = await db.runQuery(query);
      return res;
    } catch (error) {
      console.log("err noftify/get", error);
    }
  },
};
