const db = require("./db");

<<<<<<< HEAD
const tbName = "hoa_don";
const idFieldName = "id_hoa_don";
=======
const tbName = "Hoa_Don";
const idFieldName = "ID_Hoa_Don";
>>>>>>> develop

module.exports = {
  all: async () => {
    const res = await db.load(tbName);
    return res;
  },
<<<<<<< HEAD
  
  get: async (fieldName, value) => {
    const res = await db.get(tbName, fieldName, value);
    return res;
  },
=======
>>>>>>> develop
};
