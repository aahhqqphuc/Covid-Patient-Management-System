const db = require("./db");

const tbName = "benh_nhan_covid";
const idFieldName = "id_benh_nhan";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },

  get: async (fieldName, value) => {
    var query = `SELECT bn.*,tt.trang_thai, vt.tennoidieutri  FROM public.benh_nhan_covid bn join public.trang_thai_benh_nhan tt on bn.id_benh_nhan = tt.id_benh_nhan join lich_su_dieu_tri ls on ls.id_benh_nhan = bn.id_benh_nhan join noi_dieu_tri vt on vt.mavitri = ls.mavitri WHERE ls.status = '1'
  ORDER BY bn.id_benh_nhan ASC`;
    const res = await db.getByQuery(query);
    return res;
  },
  get_patient: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res;
  },
  detail_treatHis: async (id) => {
    var query = `SELECT CASE WHEN ls.status = 1 THEN 'Hiện tại'
  WHEN ls.status = 2 THEN 'Quá khứ' END as status,ngay_di_chuyen,ngay_cap_nhat,vt.tennoidieutri,tinh,huyen,xa FROM public.lich_su_dieu_tri ls join noi_dieu_tri vt on ls.mavitri =
  vt.mavitri
    where ls.id_benh_nhan = '${id}'
    ORDER BY ls.mavitri ASC`;
    const res = await db.getByQuery(query);
    res.forEach((element) => {
      element.ngay_di_chuyen =
        "Ngày " +
        element.ngay_di_chuyen.getDate() +
        " Tháng " +
        element.ngay_di_chuyen.getMonth() +
        " Năm " +
        element.ngay_di_chuyen.getFullYear();
      element.ngay_cap_nhat =
        "Ngày " +
        element.ngay_cap_nhat.getDate() +
        " Tháng " +
        element.ngay_cap_nhat.getMonth() +
        " Năm " +
        element.ngay_cap_nhat.getFullYear();
    });
    return res;
  },
  viewPatientsDetail_PatientTrailDown: async (id) => {
    var query = `SELECT bn.*,lq.noi_tiep_xuc_tinh,noi_tiep_xuc_huyen,noi_tiep_xuc_xa FROM public.benh_nhan_covid bn join public.nguoi_lien_quan lq on bn.id_benh_nhan = lq.id_nguoi_bi_lay
  where lq.id_nguoi_lay = '${id}'
ORDER BY bn.id_benh_nhan ASC `;
    const res = await db.getByQuery(query);

    return res;
  },
  viewPatientsDetail_PatientTrailUp: async (id) => {
    var query = `SELECT bn.*,lq.noi_tiep_xuc_tinh,noi_tiep_xuc_huyen,noi_tiep_xuc_xa FROM public.benh_nhan_covid bn join public.nguoi_lien_quan lq on bn.id_benh_nhan = lq.id_nguoi_lay
  where lq.id_nguoi_bi_lay = '${id}'
ORDER BY bn.id_benh_nhan ASC `;
    const res = await db.getByQuery(query);

    return res;
  },
};
