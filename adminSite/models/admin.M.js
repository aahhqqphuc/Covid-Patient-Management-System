const db = require("./db");

const tbName = "tai_khoan";
const idFieldName = "id_tai_khoan";
const tbCol = `"id_tai_khoan","user_name","password","role","status"`
module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
  get: async()=>{
    var query = `	
    select t3.id_tai_khoan,user_name,role,status,t2.action_name,t2.action_date from tai_khoan t3 left outer join
	(select distinct on(1) t1.id_account, action_name, action_date
	from (select  id_account, action_name, action_date from  admin_action_log 
	order by action_date desc) t1) t2 on t3.id_tai_khoan = t2.id_account`;
    const res = await db.runQuery(query);
    return res;
  },
  getdetail: async(id)=>{
    var query = 
    `select * from admin_action_log where id_account = ${id} order by action_date desc`;
    const res = await db.runQuery(query);
    return res;
  },
  getUsername: async(id)=>{
    const res = await db.get(tbName, idFieldName,id);
    return res;
  },
  findUser: async(name)=>{
    const res = await db.get(tbName, "user_name",name);
    return res;
  },
  lockAccount: async(id)=>{
    var query = 
    `    update tai_khoan set status = 0 where id_tai_khoan = ${id}
    `;
    const res = await db.runQuery(query);
    return res;
  },
  unlockAccount: async(id)=>{
    var query = 
    `    update tai_khoan set status = 1 where id_tai_khoan = ${id}
    `;
    const res = await db.runQuery(query);
    return res;
  },
  adduser: async (inputObj) =>{
    
    console.log(inputObj);
    var valueStr = `default,'${inputObj.user_name}','${inputObj.password}','${inputObj.role}',1`
    var res = await db.addnew(tbName,tbCol,valueStr);
    return res;
  }
};
