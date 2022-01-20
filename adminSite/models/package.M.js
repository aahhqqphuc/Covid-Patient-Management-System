const db = require("./db");

const tbNamePackage = "goi_nhu_yeu_pham";
const idFieldNamePackage = "id_goi_nhu_yeu_pham";
const tbNamePackageDetail = "chi_tiet_nhu_cau_yeu_pham";
const idFieldNamePackageDetail = "id_chi_tiet_nhu_cau_yeu_pham";
const ngay_tao = ngay_mua = ngay_cap_nhat = new Date();

module.exports = {
  all: async () => {
    const res = await db.load(tbNamePackage);
    return res;
  },

  get: async (id) => {
    const res = await db.get(tbNamePackage, idFieldNamePackage, id);
    return res;
  },

  get_package_product: async (packageId) => {
    const query = `select distinct on (n.id_nhu_yeu_pham) n.id_nhu_yeu_pham, n.ten_sanpham, d.so_luong, d.gioi_han_san_pham, n.gia_tien, n.con_lai, h.url
    from public.danh_sach_nhu_yeu_pham d, public.nhu_yeu_pham n left join public.hinh_anh_san_pham h on(n.id_nhu_yeu_pham = h.id_nhu_yeu_pham and h.mac_dinh = '1') where n.id_nhu_yeu_pham = d.id_sanpham and d.id_goi = '${packageId}'`;
    try {
      const rs = await db.runQuery(query);
      return rs;
    } catch (error) {
      console.log("error package/get_package_product :", error);
    }
  },

  // ------------------- Package Detail ----------------------------
  allPackageDetail: async () => {
    const res = await db.load(tbNamePackageDetail);
    return res;
  },
  
  getPackageDetail: async (fieldName, value) => {
    const res = await db.get(tbNamePackageDetail, fieldName, value);
    return res;
  },

  addPackageDetail: async (pDetail)=>{
    const query = `INSERT INTO ${tbNamePackageDetail}
    VALUES(default,'${pDetail.id_chi_tiet_hoa_don}','${pDetail.id_san_pham}', ${pDetail.so_luong},${pDetail.don_gia}) returning id_chi_tiet_nhu_cau_yeu_pham;`;
    try {
      var rs = await db.runQuery(query);
      return rs;
    } catch (error) {
      console.log("error packageDetail/add :", error);
    }
  }
};
