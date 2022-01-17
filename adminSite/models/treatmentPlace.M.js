const db = require("./db");

const tbName = "noi_dieu_tri";
const idFieldName = "mavitri";
const tbCol = `mavitri,tennoidieutri,tinh,huyen,xa,succhua,soluonghientai`
module.exports = {
  all: async () => {
    try{
    const res = await db.getDb.any('Select * from public.noi_dieu_tri')
    return res;
    }
    catch (error) {
      console.log("error db/filter :", error);
      console.log("query  :", query);
    }

    
  },

  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  },
  addnew: async (inputObj) =>{
    var valueStr = `default,'${inputObj.tennoidieutri}','${inputObj.tinh}','${inputObj.huyen}','${inputObj.xa}',${inputObj.succhua},${inputObj.soluonghientai}`
    var res = await db.addnew(tbName,tbCol,valueStr);
    return res;
  }
};
