const db = require("./db");

const tbName = "goi_nhu_yeu_pham";
const idFieldName = "id_goi_nhu_yeu_pham";
const ngay_tao = ngay_mua = ngay_cap_nhat = new Date();

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },

  get: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res;
  },

  get_package_product: async (packageId) => {
    const query = `select distinct on (n.id_nhu_yeu_pham) n.id_nhu_yeu_pham, n.ten_sanpham, d.so_luong, n.gia_tien, h.url
    from public.danh_sach_nhu_yeu_pham d, public.nhu_yeu_pham n left join public.hinh_anh_san_pham h on(n.id_nhu_yeu_pham = h.id_nhu_yeu_pham and h.mac_dinh = '1') where n.id_nhu_yeu_pham = d.id_sanpham and d.id_goi = '${packageId}'`;
    try {
      const rs = await db.runQuery(query);
      return rs;
    } catch (error) {
      console.log("error package/get_package_product :", error);
    }
  }
};
