const { table } = require("console");

const pgPromise = require("pg-promise")({
  capSQL: true,
});
const schema = "public";
const connectionString = {
  user: "postgres",
  host: "localhost",
  database: "WebProject",
  password: "master",
  port: 5432,
  max: 30,
};
const db = pgPromise(connectionString);
exports.load = async (tbName) => {
  const table = new pgPromise.helpers.TableName({
    table: tbName,
    schema: schema,
  });
  const query = pgPromise.as.format("Select * from $1", table);
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/load :", error);
  }
};
exports.get = async (tbName, fieldName, value) => {
  const table = new pgPromise.helpers.TableName({
    table: tbName,
    schema: schema,
  });
  const query = pgPromise.as.format(`Select * from $1 where  "${fieldName}"='${value}'`, table);
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/get :", error);
  }
};
exports.add = async (tbName, entity) => {
  const table = new pgPromise.helpers.TableName({
    table: tbName,
    schema: schema,
  });
  const query = pgPromise.helpers.insert(entity, null, table) + "RETURNING *";
  console.log(query);
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/add :", error);
  }
};
exports.edit = async (tbName, fieldName, entity) => {
  const table = new pgPromise.helpers.TableName({
    table: tbName,
    schema: schema,
  });
  const condition = pgPromise.as.format(` WHERE "${fieldName}" = ${entity.CatID}`);
  const query = pgPromise.helpers.update(entity, ["CatName", "CatDescription"], table) + condition;
  console.log(query);
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/add :", error);
  }
};
exports.delete = async (tbName, fieldName, id) => {
  const table = new pgPromise.helpers.TableName({
    table: tbName,
    schema: schema,
  });
  const query = pgPromise.as.format(`Delete  from $1 where  "${fieldName}"='${id}'`, table);
  console.log(query);
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/add :", error);
  }
};



exports.viewPatientsList = async () => {
  const query = `SELECT bn.*,tt.trang_thai, vt.tennoidieutri  FROM public.benh_nhan_covid bn join public.trang_thai_benh_nhan tt on bn.id_benh_nhan = tt.id_benh_nhan join lich_su_dieu_tri ls on ls.id_benh_nhan = bn.id_benh_nhan join noi_dieu_tri vt on vt.mavitri = ls.mavitri WHERE ls.status = '1'
  ORDER BY bn.id_benh_nhan ASC`;
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/add :", error);
  }
};


exports.viewPatientsDetail_TreatmentHis = async (id) => {
  const query = `SELECT CASE WHEN ls.status = 1 THEN 'Hiện tại'
  WHEN ls.status = 2 THEN 'Quá khứ' END as status,ngay_di_chuyen,ngay_cap_nhat,vt.tennoidieutri,tinh,huyen,xa FROM public.lich_su_dieu_tri ls join noi_dieu_tri vt on ls.mavitri =
  vt.mavitri
    where ls.id_benh_nhan = '${id}'
    ORDER BY ls.mavitri ASC`;
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/add :", error);
  }
};



exports.viewPatientsDetail_PatientTrailDown = async (id) => {
  const query = `SELECT bn.*,lq.noi_tiep_xuc_tinh,noi_tiep_xuc_huyen,noi_tiep_xuc_xa FROM public.benh_nhan_covid bn join public.nguoi_lien_quan lq on bn.id_benh_nhan = lq.id_nguoi_lien_quan_khac
  where lq.id_nguoi_lay = '${id}'
ORDER BY bn.id_benh_nhan ASC `;
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/add :", error);
  }
};



exports.viewPatientsDetail_PatientTrailUp = async (id) => {
  const query = `SELECT bn.*,lq.noi_tiep_xuc_tinh,noi_tiep_xuc_huyen,noi_tiep_xuc_xa FROM public.benh_nhan_covid bn join public.nguoi_lien_quan lq on bn.id_benh_nhan = lq.id_nguoi_lay
  where lq.id_nguoi_lien_quan_khac = '${id}'
ORDER BY bn.id_benh_nhan ASC `;
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/add :", error);
  }
};