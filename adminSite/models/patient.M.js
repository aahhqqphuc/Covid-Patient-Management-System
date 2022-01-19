const db = require("./db");
const tbName = "benh_nhan_covid";
const idFieldName = "id_benh_nhan";

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res.length > 0 ? res : null;
  },

  add: async (patient) => {
    const res = await db.add(tbName, patient);
    return res;
  },

  edit: async (patient) => {
    const res = await db.edit(tbName, idFieldName, patient);
    return res;
  },

  delete: async (id) => {
    const res = await db.delete(tbName, idFieldName, id);
    return res;
  },

  get: async () => {
    var query = `SELECT bn.*,tt.trang_thai, vt.tennoidieutri  
      FROM public.benh_nhan_covid bn join public.trang_thai_benh_nhan tt on bn.id_benh_nhan = tt.id_benh_nhan 
        join lich_su_dieu_tri ls on ls.id_benh_nhan = bn.id_benh_nhan join noi_dieu_tri vt on vt.mavitri = ls.mavitri 
      WHERE ls.status = '1'
      ORDER BY bn.id_benh_nhan ASC`;
    const res = await db.runQuery(query);
    return res;
  },

  get_patient: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res;
  },

  detail_treatHis: async (id,page, pagesize) => {
    var query = `SELECT CASE WHEN ls.status = 1 THEN 'Hiện tại'
        WHEN ls.status = 2 THEN 'Quá khứ' END as status,ngay_di_chuyen,ngay_cap_nhat,vt.tennoidieutri,tinh,huyen,xa 
      FROM public.lich_su_dieu_tri ls join noi_dieu_tri vt on ls.mavitri = vt.mavitri
      where ls.id_benh_nhan = '${id}'
      ORDER BY ls.mavitri ASC limit ${pagesize} offset ${pagesize * (page - 1)}; `;
      const qtotal = `select count(*) from lich_su_dieu_tri ls where ls.id_benh_nhan = '${id}'`;
      try {
        const r1 = await db.getDb.any(query);
        r1.forEach((element) => {
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
        const r2 = await db.getDb.any(qtotal);
        return { data: r1, total: r2[0].count };
      } 
      catch (error) {
        console.log("error db/all :", error);
      };
  },

  viewPatientsDetail_PatientTrailDown: async (id,page, pagesize) => {
    var query = `SELECT bn.*,lq.noi_tiep_xuc_tinh,noi_tiep_xuc_huyen,noi_tiep_xuc_xa 
      FROM public.benh_nhan_covid bn join public.nguoi_lien_quan lq on bn.id_benh_nhan = lq.id_nguoi_bi_lay
      where lq.id_nguoi_lay = '${id}'
      ORDER BY bn.id_benh_nhan ASC limit ${pagesize} offset ${pagesize * (page - 1)}; `;
      const qtotal = `select count(*) from public.nguoi_lien_quan lq where lq.id_nguoi_lay = '${id}'`;
      try {
        const r1 = await db.getDb.any(query);
        const r2 = await db.getDb.any(qtotal);
        return { data: r1, total: r2[0].count };
      } 
      catch (error) {
        console.log("error db/all :", error);
      };;
  },

  viewPatientsDetail_PatientTrailUp: async (id,page, pagesize) => {
    var query = `SELECT bn.*,lq.noi_tiep_xuc_tinh,noi_tiep_xuc_huyen,noi_tiep_xuc_xa 
      FROM public.benh_nhan_covid bn join public.nguoi_lien_quan lq on bn.id_benh_nhan = lq.id_nguoi_lay
      where lq.id_nguoi_bi_lay = '${id}'
      ORDER BY bn.id_benh_nhan ASC limit ${pagesize} offset ${pagesize * (page - 1)}; `;
      const qtotal = `select count(*) from public.nguoi_lien_quan lq where lq.id_nguoi_bi_lay = '${id}'`;
      try {
        const r1 = await db.getDb.any(query);
        const r2 = await db.getDb.any(qtotal);
        return { data: r1, total: r2[0].count };
      } 
      catch (error) {
        console.log("error db/all :", error);
      };
  },

  checkExistsIdNumber: async (idNumber) => {
    const query = `select * from public.benh_nhan_covid bn where cmnd = '${idNumber}'`;

    return (await db.runQuery(query)).length === 0 ? false : true;
  },
  getPaging: async (page, pagesize) => {
    const query = `select distinct on (bn.ID_Benh_Nhan) bn.ID_Benh_Nhan, bn.Ho_Ten,bn.CMND,bn.Nam_Sinh,bn.Tinh,bn.Huyen,bn.Xa,tt.trang_thai,vt.tennoidieutri 
    FROM public.benh_nhan_covid bn join public.trang_thai_benh_nhan tt on bn.id_benh_nhan = tt.id_benh_nhan 
        join lich_su_dieu_tri ls on ls.id_benh_nhan = bn.id_benh_nhan join noi_dieu_tri vt on vt.mavitri = ls.mavitri 
      WHERE ls.status = '1'
      ORDER BY bn.id_benh_nhan ASC limit ${pagesize} offset ${pagesize * (page - 1)}; `;
    const qtotal = `select count(*) from benh_nhan_covid `;
    try {
      const r1 = await db.getDb.any(query);
      const r2 = await db.getDb.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
  getTinh: async () => {
    try{
    var query = `SELECT *
      FROM public.tinh
      ORDER BY id_tinh ASC`;
      const res = await db.runQuery(query);
      return res;
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
  filter: async (tinh,trangthai, sortby, asc, search, page, pagesize) => {
    const query = `select * from
    (select distinct on (bn.ID_Benh_Nhan) bn.ID_Benh_Nhan, bn.Ho_Ten,bn.CMND,bn.Nam_Sinh,bn.Tinh,bn.Huyen,bn.Xa,tt.trang_thai,vt.tennoidieutri 
    FROM public.benh_nhan_covid bn join public.trang_thai_benh_nhan tt on bn.id_benh_nhan = tt.id_benh_nhan 
        join lich_su_dieu_tri ls on ls.id_benh_nhan = bn.id_benh_nhan join noi_dieu_tri vt on vt.mavitri = ls.mavitri 
      WHERE ls.status = '1' and bn.ho_ten like '%${search}%' and
    bn.tinh like '%${tinh}%' and tt.trang_thai = ${trangthai}) data order by ${sortby} ${asc}
    limit ${pagesize} offset ${pagesize * (page - 1)}`;

    const qtotal = `select count(*) from benh_nhan_covid bn join public.trang_thai_benh_nhan tt on bn.id_benh_nhan = tt.id_benh_nhan
    where bn.tinh like '%${tinh}%'  and ho_ten like '%${search}%' and tt.trang_thai = ${trangthai} `;
    try {
      const r1 = await db.getDb.any(query);
      const r2 = await db.getDb.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
  
  filter1: async (tinh, sortby, asc, search, page, pagesize) => {
    const query = `select * from
    (select distinct on (bn.ID_Benh_Nhan) bn.ID_Benh_Nhan, bn.Ho_Ten,bn.CMND,bn.Nam_Sinh,bn.Tinh,bn.Huyen,bn.Xa,tt.trang_thai,vt.tennoidieutri 
    FROM public.benh_nhan_covid bn join public.trang_thai_benh_nhan tt on bn.id_benh_nhan = tt.id_benh_nhan 
        join lich_su_dieu_tri ls on ls.id_benh_nhan = bn.id_benh_nhan join noi_dieu_tri vt on vt.mavitri = ls.mavitri 
      WHERE ls.status = '1' and bn.ho_ten like '%${search}%' and
    bn.tinh like '%${tinh}%' ) data order by ${sortby} ${asc}
    limit ${pagesize} offset ${pagesize * (page - 1)}`;
    
    const qtotal = `select count(*) from benh_nhan_covid bn join public.trang_thai_benh_nhan tt on bn.id_benh_nhan = tt.id_benh_nhan
    where bn.tinh like '%${tinh}%'  and ho_ten like '%${search}%' `;
    try {
      const r1 = await db.getDb.any(query);
      const r2 = await db.getDb.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
};
