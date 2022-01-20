const db = require("./db").getDb;
function getOpposite(status) {
  switch (status) {
    case -1:
      return -1;
    case 0:
      return 1;
    case 1:
      return 0;
    default:
      return -1;
  }
}
module.exports = {
  getPaging: async (page, pagesize, status) => {
    const opposite = getOpposite(status);
    const query = `select distinct on (p.id_nhu_yeu_pham) p.id_nhu_yeu_pham, p.ten_sanpham,p.gia_tien,p.don_vi,p.con_lai,url,status
    from nhu_yeu_pham p left join hinh_anh_san_pham img 
		on p.id_nhu_yeu_pham = img.id_nhu_yeu_pham 
    where status != ${opposite}
		order by p.id_nhu_yeu_pham limit ${pagesize} offset ${pagesize * (page - 1)}; `;
    const qtotal = `select count(*) from nhu_yeu_pham where status != ${opposite} `;
    try {
      const r1 = await db.any(query);
      const r2 = await db.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
  filter: async (priceFrom, priceTo, sortby, asc, search, page, pagesize, status) => {
    const opposite = getOpposite(status);
    const query = `select * from 
    (select distinct on (p.id_nhu_yeu_pham) p.id_nhu_yeu_pham, p.ten_sanpham,p.gia_tien,p.don_vi,p.con_lai,url,status 
    from nhu_yeu_pham p left join hinh_anh_san_pham img 
		on p.id_nhu_yeu_pham = img.id_nhu_yeu_pham 
		where  ten_sanpham like '%${search}%' and status != ${opposite} and
    gia_tien between ${priceFrom} and ${priceTo} ) data order by ${sortby} ${asc}
    limit ${pagesize} offset ${pagesize * (page - 1)}`;
    const qtotal = `select count(*) from nhu_yeu_pham 
    where gia_tien between ${priceFrom} and ${priceTo} 
    and ten_sanpham like '%${search}%' and  status != ${opposite} `;
    try {
      const r1 = await db.any(query);
      const r2 = await db.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
  getById: async (id) => {
    const q1 = `SELECT * FROM public.nhu_yeu_pham where id_nhu_yeu_pham = ${id}`;
    const q2 = `SELECT * FROM public.hinh_anh_san_pham where id_nhu_yeu_pham = ${id}`;

    try {
      const pro = await db.any(q1);
      const images = await db.any(q2);
      return { pro, images };
    } catch (error) {
      console.log("error detail/add :", error);
    }
  },
  add: async (pro) => {
    const query = `INSERT INTO Nhu_Yeu_Pham 
    VALUES(default,N'${pro.ten_sanpham}',${pro.gia_tien},'VND',${pro.con_lai}) returning id_nhu_yeu_pham;`;
    try {
      var rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("error db/add :", error);
    }
  },
  addImg: async (img) => {
    const query = `INSERT INTO Hinh_Anh_San_Pham VALUES(default,${img.id_nhu_yeu_pham},'${img.url}');`;
    try {
      const rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("error db/add :", error);
    }
  },
  edit: async (pro) => {
    const query = `update Nhu_Yeu_Pham 
                  set ten_sanpham = '${pro.ten_sanpham}',gia_tien = ${pro.gia_tien}, con_lai = con_lai + ${pro.con_lai}
                  where id_nhu_yeu_pham = ${pro.id_nhu_yeu_pham};`;
    try {
      return await db.any(query);
    } catch (error) {
      console.log("error edit pro :", error);
    }
  },
  disable: async (id) => {
    const query = `update Nhu_Yeu_Pham 
                  set status = 0
                  where id_nhu_yeu_pham = ${id};`;
    try {
      return await db.any(query);
    } catch (error) {
      console.log("error edit pro :", error);
    }
  },
  enable: async (id) => {
    const query = `update Nhu_Yeu_Pham 
                  set status = 1
                  where id_nhu_yeu_pham = ${id};`;
    try {
      return await db.any(query);
    } catch (error) {
      console.log("error edit pro :", error);
    }
  },

  deleteImg: async (id) => {
    const query = `delete from Hinh_Anh_San_Pham where id_hinh_anh = ${id};`;
    const imgQuery = `select * from Hinh_Anh_San_Pham where id_hinh_anh = ${id};`;
    try {
      var rs = await db.any(imgQuery);
      if (rs) {
        await db.any(query);
        return rs;
      }
    } catch (error) {
      console.log("delete img error :", error);
    }
  },
};
