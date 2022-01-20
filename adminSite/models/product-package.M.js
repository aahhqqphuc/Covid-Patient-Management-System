const db = require("./db").getDb;
function getOpposite(role) {
  switch (role) {
    case "manager":
      return -1;
    case "patient":
      return 0;
    default:
      return -1;
  }
}
module.exports = {
  getAll: async (page, pagesize, role) => {
    const opposite = getOpposite(role);
    const query = `SELECT distinct on (g.id_goi_nhu_yeu_pham) g.id_goi_nhu_yeu_pham, g.status,
        g.ten_goi,img.url,g.thoi_gian,
        to_string(g.muc_gioi_han_goi) muc_gioi_han_goi_string,
        c.count as So_luong_san_pham
        FROM goi_nhu_yeu_pham g 
        left join danh_sach_nhu_yeu_pham ds on g.id_goi_nhu_yeu_pham = ds.id_goi
        left join nhu_yeu_pham nyp on ds.id_sanpham = nyp.id_nhu_yeu_pham
        left join hinh_anh_san_pham img on nyp.id_nhu_yeu_pham = img.id_nhu_yeu_pham
        left join (select count( id_goi ) as count ,id_goi 
        from danh_sach_nhu_yeu_pham group by id_goi) c on ds.id_goi = c.id_goi 
        where g.status != ${opposite} and img.url is not null
        order by g.id_goi_nhu_yeu_pham limit ${pagesize} offset ${pagesize * (page - 1)}; `;
    const qtotal = `select count(*) from goi_nhu_yeu_pham where status != ${opposite}`;
    try {
      const r1 = await db.any(query);
      const r2 = await db.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
      console.log("query  :", query);
    }
  },
  filter: async (period, sortby, asc, search, page, pagesize, role) => {
    const opposite = getOpposite(role);
    let query = `select * from 
            (SELECT distinct on (g.id_goi_nhu_yeu_pham) g.id_goi_nhu_yeu_pham, g.status,
            g.ten_goi,img.url,g.thoi_gian,g.muc_gioi_han_goi,
            to_string(g.muc_gioi_han_goi) muc_gioi_han_goi_string,
            c.count as So_luong_san_pham, calculate_time(g.thoi_gian,g.muc_gioi_han_goi) thoi_gian_tinh_toan
            FROM goi_nhu_yeu_pham g 
            left join danh_sach_nhu_yeu_pham ds on g.id_goi_nhu_yeu_pham = ds.id_goi
            left join nhu_yeu_pham nyp on ds.id_sanpham = nyp.id_nhu_yeu_pham
            left join hinh_anh_san_pham img on nyp.id_nhu_yeu_pham = img.id_nhu_yeu_pham
            left join (select count( id_goi ) as count ,id_goi 
                from danh_sach_nhu_yeu_pham group by id_goi) c on ds.id_goi = c.id_goi) data
                where ten_goi like '%${search}%' and status != ${opposite} `;
    query += period != -1 ? `and muc_gioi_han_goi = ${period}` : "";
    query += `order by ${sortby} ${asc} limit ${pagesize} offset ${pagesize * (page - 1)}; `;

    let qtotal = `select count(*) from goi_nhu_yeu_pham where ten_goi like '%${search}%' and status != ${opposite} `;
    qtotal += period != -1 ? `and muc_gioi_han_goi = ${period}` : "";
    try {
      const r1 = await db.any(query);
      const r2 = await db.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/filter :", error);
      console.log("query  :", query);
    }
  },
  getById: async (id) => {
    const q1 = `SELECT id_goi_nhu_yeu_pham, status,
            ten_goi,thoi_gian,muc_gioi_han_goi,
            to_string(muc_gioi_han_goi) muc_gioi_han_goi_string
           FROM public.goi_nhu_yeu_pham where id_goi_nhu_yeu_pham = ${id}`;
    const q2 = `select distinct on (p.id_nhu_yeu_pham) ds.id_danh_sach_goi, 
    p.id_nhu_yeu_pham, p.ten_sanpham,url,gioi_han_san_pham,p.gia_tien,p.status,p.mo_ta,p.con_lai
    from danh_sach_nhu_yeu_pham ds join nhu_yeu_pham p  on ds.id_sanpham = p.id_nhu_yeu_pham
	left join hinh_anh_san_pham img on p.id_nhu_yeu_pham = img.id_nhu_yeu_pham where ds.id_goi = ${id}`;
    try {
      const package = await db.any(q1);
      const products = await db.any(q2);
      return { package, products };
    } catch (error) {
      console.log("error getById :", error);
      console.log(q1);
    }
  },
  add: async (package) => {
    const query = `INSERT INTO Goi_Nhu_Yeu_Pham 
    VALUES(default,'${package.ten_goi}',${package.muc_gioi_han},${package.thoi_gian},1) returning id_goi_nhu_yeu_pham;`;
    try {
      var rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("error db/add :", error);
    }
  },
  addProduct: async (id_goi, id_sanpham, gioi_han) => {
    const query = `INSERT INTO danh_sach_nhu_yeu_pham VALUES(default,'${id_goi}',${id_sanpham},${gioi_han},${gioi_han});`;
    try {
      const rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("error db/add :", error);
      console.log("insert", query);
    }
  },
  edit: async (package) => {
    const query = `update Goi_Nhu_Yeu_Pham 
                  set ten_goi = '${package.ten_goi}',thoi_gian = ${package.thoi_gian}, 
                  muc_gioi_han_goi = ${package.muc_gioi_han_goi}
                  where id_goi_nhu_yeu_pham = ${package.id_goi_nhu_yeu_pham};`;
    try {
      return await db.any(query);
    } catch (error) {
      console.log("error edit  :", error);
    }
  },
  editProduct: async (id, gioi_han) => {
    const query = `update danh_sach_nhu_yeu_pham set gioi_han_san_pham = ${gioi_han} 
                    where id_danh_sach_goi = ${id}`;
    try {
      const rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("error db/add :", error);
    }
  },

  deleteProduct: async (id) => {
    const query = `delete from danh_sach_nhu_yeu_pham where id_danh_sach_goi = ${id} returning id_goi`;
    try {
      var rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("delete pro error :", error);
    }
  },
  getPackageId: async (id) => {
    const query = `select id_goi from danh_sach_nhu_yeu_pham where id_danh_sach_goi = ${id}`;
    try {
      var rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("delete pro error :", error);
    }
  },
  getElseProducts: async (packageId) => {
    const query = `select distinct on (p.id_nhu_yeu_pham) p.id_nhu_yeu_pham, p.ten_sanpham,p.gia_tien,p.don_vi,p.con_lai,url
                  from nhu_yeu_pham p 
				  left join hinh_anh_san_pham img 
                  on p.id_nhu_yeu_pham = img.id_nhu_yeu_pham 
				  where p.id_nhu_yeu_pham not in 
          ( SELECT id_sanpham FROM public.danh_sach_nhu_yeu_pham where id_goi = ${packageId} )
				  and p.status = 1
                  order by p.id_nhu_yeu_pham`;
    try {
      var rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("get all pro error :", error);
    }
  },
  getProducts: async (idArr) => {
    if (idArr == "") return null;
    const query = `select distinct on (p.id_nhu_yeu_pham) p.id_nhu_yeu_pham, p.ten_sanpham,p.gia_tien,p.don_vi,p.con_lai,url 
                  from nhu_yeu_pham p left join hinh_anh_san_pham img 
                  on p.id_nhu_yeu_pham = img.id_nhu_yeu_pham where p.id_nhu_yeu_pham in (${idArr})`;
    try {
      var rs = await db.any(query);
      return rs;
    } catch (error) {
      console.log("get all pro error :", error);
    }
  },
  disable: async (id) => {
    const query = `update goi_Nhu_Yeu_Pham 
                  set status = 0
                  where id_goi_nhu_yeu_pham = ${id};`;
    try {
      return await db.any(query);
    } catch (error) {
      console.log("error edit pro :", error);
    }
  },
  enable: async (id) => {
    const query = `update goi_Nhu_Yeu_Pham 
                  set status = 1
                  where id_goi_nhu_yeu_pham = ${id};`;
    try {
      return await db.any(query);
    } catch (error) {
      console.log("error edit pro :", error);
    }
  },
  getPackageProducts: async (id) => {
    const packageQuery = `select id_goi_nhu_yeu_pham, ten_goi
    from public.goi_nhu_yeu_pham where id_goi_nhu_yeu_pham = '${id}'`;

    const packageProductsQuery = `select distinct on (n.id_nhu_yeu_pham) n.id_nhu_yeu_pham, n.ten_sanpham, n.con_lai, n.mo_ta, d.so_luong, d.gioi_han_san_pham, n.gia_tien, h.url
    from public.danh_sach_nhu_yeu_pham d, public.nhu_yeu_pham n left join public.hinh_anh_san_pham h on(n.id_nhu_yeu_pham = h.id_nhu_yeu_pham) where n.id_nhu_yeu_pham = d.id_sanpham and d.id_goi = '${id}'`;

    try {
      const package = await db.any(packageQuery);
      const packageProducts = await db.any(packageProductsQuery);
      return { package, packageProducts };
    } catch (error) {
      console.log("err at getPackageProduct", error);
    }
  },

  checkPuchase: async (idPatient, idPackage) => {
    const query = `SELECT * FROM hoa_don h, chi_tiet_hoa_don c
    where h.id_nguoi_mua = ${idPatient}
     and c.id_goi_nhu_cau_yeu_pham = ${idPackage}
     and h.id_hoa_don = c.id_hoa_don
     and DATE_PART('day', CURRENT_DATE::timestamp - ngay_mua::timestamp) < (
    select calculate_time(thoi_gian, muc_gioi_han_goi)
    from goi_nhu_yeu_pham
    where id_goi_nhu_yeu_pham = ${idPackage})`;

    try {
      const res = await db.any(query);
      return res;
    } catch (error) {
      console.log("err checkPuchase", error);
    }
  },
}
