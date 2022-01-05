const db = require("./db").getDb;

module.exports = {
  getPaging: async (page) => {
    const query = `select distinct(p.id_nhu_yeu_pham), p.ten_sanpham,p.gia_tien,p.don_vi,p.con_lai,url 
    from nhu_yeu_pham p join hinh_anh_san_pham img 
		on p.id_nhu_yeu_pham = img.id_nhu_yeu_pham 
		where img.mac_dinh = 1 order by p.id_nhu_yeu_pham limit 7 offset ${7 * (page - 1)}; `;
    try {
      const res = await db.any(query);
      return res;
    } catch (error) {
      console.log("error db/add :", error);
    }
  },
  count: async () => {
    const query = `select count(*) from nhu_yeu_pham `;
    try {
      const res = await db.any(query);
      return res[0].count;
    } catch (error) {
      console.log("error db/add :", error);
    }
  },
  getById: async (id) => {
    const query = `select top(1) distinct(p.id_nhu_yeu_pham), p.ten_sanpham,p.gia_tien,p.don_vi,p.con_lai,url from nhu_yeu_pham p join hinh_anh_san_pham img 
		on p.id_nhu_yeu_pham = img.id_nhu_yeu_pham 
		where img.mac_dinh = 1 and p.id_nhu_yeu_pham = ${id}  order by p.id_nhu_yeu_pham; `;
    try {
      const res = await db.any(query);
      return res;
    } catch (error) {
      console.log("error db/add :", error);
    }
  },
};
