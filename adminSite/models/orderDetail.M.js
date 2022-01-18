const db = require("./db");

const tbName = "chi_tiet_hoa_don";
const idFieldName = "id_chi_tiet";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
  
  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  },
  add: async (oDetail)=>{
    const query = `INSERT INTO ${tbName}
    VALUES(default,'${oDetail.id_hoa_don}','${oDetail.id_goi_nhu_cau_yeu_pham}',${oDetail.total}) returning id_chi_tiet;`;
    try {
      const rs = await db.runQuery(query);
      return rs[0];
    } catch (error) {
      console.log("error orderDetail/add :", error);
    }
  }
};
