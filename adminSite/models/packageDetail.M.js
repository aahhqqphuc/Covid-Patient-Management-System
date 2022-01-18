const db = require("./db");

const tbName = "chi_tiet_nhu_cau_yeu_pham";
const idFieldName = "id_chi_tiet_nhu_cau_yeu_pham";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
  
  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  },

  add: async (pDetail)=>{
    const query = `INSERT INTO ${tbName}
    VALUES(default,'${pDetail.id_chi_tiet_hoa_don}','${pDetail.id_san_pham}', ${pDetail.so_luong},${pDetail.don_gia}) returning id_chi_tiet_nhu_cau_yeu_pham;`;
    try {
      var rs = await db.runQuery(query);
      return rs;
    } catch (error) {
      console.log("error packageDetail/add :", error);
    }
  }
};
