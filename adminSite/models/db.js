const { query } = require("express");

require("dotenv").config();

const pgPromise = require("pg-promise")({
  capSQL: true,
});

const schema = "public";
const connectionString = {
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.db_port,
  max: process.env.db_max,
};

const db = pgPromise(connectionString);

exports.getDb = db;

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
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/add :", query);
  }
};

exports.edit = async (tbName, fieldName, entity) => {
  const table = new pgPromise.helpers.TableName({
    table: tbName,
    schema: schema,
  });
  const condition = pgPromise.as.format(` WHERE "${fieldName}" = ${entity.CatID}`);
  const query = pgPromise.helpers.update(entity, ["CatName", "CatDescription"], table) + condition;
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/edit :", error);
  }
};

exports.delete = async (tbName, fieldName, id) => {
  const table = new pgPromise.helpers.TableName({
    table: tbName,
    schema: schema,
  });
  const query = pgPromise.as.format(`Delete  from $1 where  "${fieldName}"='${id}'`, table);
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/delete :", error);
  }
};

exports.runQuery = async (query) => {
  try {
    const res = await db.any(query);
    return res;
  } catch (error) {
    console.log("error db/runQuery :", error);
  }
};

exports.getSingleResut = async (query) => {
  try {
    const res = await db.one(query);
    return res;
  } catch (error) {
    console.log("error db/getSingleResut :", error);
  }
};

module.exports.addnew = async (tbName, tbCol, valueStr) => {
  console.log(valueStr);
  var table = new pgPromise.helpers.TableName({ table: tbName, schema: schema });
  var qStr = pgPromise.as.format(`INSERT INTO  $1(${tbCol}) VALUES (${valueStr})`, table);
  try {
    await db.any(qStr);

    return ["success"];
  } catch (error) {
    return ["error", error];
  }
};
exports.tableName = {
  benh_nhan_covid: "benh_nhan_covid",
  chi_tiet_hoa_don: "chi_tiet_hoa_don",
  chi_tiet_nhu_yeu_pham: "chi_tiet_nhu_yeu_pham",
  danh_sach_nhu_yeu_pham: "danh_sach_nhu_yeu_pham",
  giao_dich: "giao_dich",
  goi_nhu_yeu_pham: "goi_nhu_yeu_pham",
  han_muc: "han_muc",
  hinh_anh_san_pham: "hinh_anh_san_pham",
  hoa_don: "hoa_don",
  huyen: "huyen",
  lich_su_dieu_tri: "lich_su_dieu_tri",
  nguoi_lien_quan: "nguoi_lien_quan",
  nhu_yeu_pham: "nhu_yeu_pham",
  noi_dieu_tri: "noi_dieu_tri",
  tai_khoan: "tai_khoan",
  tai_khoan_thanh_toan: "tai_khoan_thanh_toan",
  tinh: "tinh",
  trang_thai_benh_nhan: "trang_thai_benh_nhan",
  xa: "xa",
};
