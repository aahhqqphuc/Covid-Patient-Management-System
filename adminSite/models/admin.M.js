const db = require("./db");

const tbName = "tai_khoan";
const idFieldName = "id_tai_khoan";
const tbCol = `"id_tai_khoan","user_name","password","role","status"`;
module.exports = {
  all: async () => {
    const res = await db.load(db.tableName.tai_khoan);
    return res;
  },
  get: async () => {
    var query = `	
    select t3.id_tai_khoan,user_name,role,CASE
    WHEN status = 1 THEN 'Hoạt động'
    WHEN status = 0 THEN 'Khoá'
    ELSE 'The quantity is under 30'
END AS status,t2.action_name,t2.action_date from tai_khoan t3 left outer join
	(select distinct on(1) t1.id_account, action_name, action_date
	from (select  id_account, action_name, action_date from  admin_action_log
    
	order by action_date desc) t1) t2 on t3.id_tai_khoan = t2.id_account
	where t3.role != 'user' `;
    const res = await db.runQuery(query);
    return res;
  },
  getPaging: async (page, pagesize) => {
    const query = `select t3.id_tai_khoan,user_name,role,CASE
    WHEN status = 1 THEN 'Hoạt động'
    WHEN status = 0 THEN 'Khoá'
    ELSE 'The quantity is under 30'
END AS status,t2.action_name,t2.action_date from tai_khoan t3 left outer join
	(select distinct on(1) t1.id_account, action_name, action_date
	from (select  id_account, action_name, action_date from  admin_action_log
    
	order by action_date desc) t1) t2 on t3.id_tai_khoan = t2.id_account
	where t3.role != 'user' limit ${pagesize} offset ${pagesize * (page - 1)}; `;
    const qtotal = `select count(*) from tai_khoan where role != 'user'`;
    try {
      const r1 = await db.getDb.any(query);
      const r2 = await db.getDb.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
  getdetail: async (id,page, pagesize) => {
    const query = `select * from admin_action_log where id_account = ${id} order by action_date desc limit ${pagesize} offset ${pagesize * (page - 1)}; `;
    const qtotal = `select count(*) from admin_action_log where id_account = ${id};`;
    try {
      const r1 = await db.getDb.any(query);
      const r2 = await db.getDb.any(qtotal);
      return { data: r1, total: r2[0].count };
    } catch (error) {
      console.log("error db/all :", error);
    }
  },
  getUsername: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res;
  },
  findUser: async (name) => {
    const res = await db.get(tbName, "user_name", name);
    return res;
  },
  lockAccount: async (id) => {
    var query = `    update tai_khoan set status = 0 where id_tai_khoan = ${id};
    `;
    const res = await db.runQuery(query);
    return res;
  },
  unlockAccount: async (id) => {
    var query = `    update tai_khoan set status = 1 where id_tai_khoan = ${id};
    `;
    const res = await db.runQuery(query);
    return res;
  },
  deleteAction: async (id) => {
    var query = `Delete from admin_action_log where id_action = ${id}`;
    const res = await db.runQuery(query);
    return res;
  },
  adduser: async (inputObj) => {
    var valueStr = `default,'${inputObj.user_name}','${inputObj.password}','${inputObj.role}',1`;
    var res = await db.addnew(tbName, tbCol, valueStr);
    return res;
  },
};
