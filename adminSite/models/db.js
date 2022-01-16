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



module.exports.addnew = async (tbName,tbCol,valueStr) =>{
  console.log(valueStr);
  var table  = new pgPromise.helpers.TableName({table: tbName,schema: schema});
  var qStr = pgPromise.as.format(`INSERT INTO  $1(${tbCol}) VALUES (${valueStr})`,table);
  try{
      await db.any(qStr);
      
      return ["success"];
  }
  catch(error)
  {
      return ["error",error];
  }
  
}