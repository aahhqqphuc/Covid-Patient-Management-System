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
    }

    
  },
  getbyID: async(id)=>{
    try{
      const res = await db.getDb.any(`Select * from public.noi_dieu_tri where mavitri = ${id}`)
      return res;
      }
      catch (error) {
        console.log("error db/filter :", error);
      }
  },
  getPaging: async (page, pagesize) => {
    const query = `Select * from public.noi_dieu_tri limit ${pagesize} offset ${pagesize * (page - 1)}; `;
    const qtotal = `select count(*) from noi_dieu_tri `;
    try {
      const r1 = await db.getDb.any(query);
      const r2 = await db.getDb.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
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
  },
  edit: async (inputObj) =>{
    var query = `UPDATE public.noi_dieu_tri set tennoidieutri = '${inputObj.tennoidieutri}', tinh = '${inputObj.tinh}', huyen = '${inputObj.huyen}', xa = '${inputObj.xa}',succhua = ${inputObj.succhua},soluonghientai = ${inputObj.soluonghientai}
    where mavitri = ${inputObj.mavitri}`
    const res = await db.getDb.any(query);
    return res;
  },
  filter: async (tinh, search, page, pagesize) => {
    if(tinh == "All")
      tinh = '';
    const query = `select * from
    public.noi_dieu_tri
      WHERE tennoidieutri like '%${search}%' and
    tinh like '%${tinh}%'
    limit ${pagesize} offset ${pagesize * (page - 1)}`;

    const qtotal = `select count(*) from
    public.noi_dieu_tri
      WHERE tennoidieutri like '%${search}%' and
    tinh like '%${tinh}%'`;
    try {
      const r1 = await db.getDb.any(query);
      const r2 = await db.getDb.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
};
