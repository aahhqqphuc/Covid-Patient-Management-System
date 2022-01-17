const db = require("./db");

module.exports = {
  getCommuneByDistrictId: async (id) => {
    const res = await db.get(db.tableName.xa, "id_huyen", id);
    return res.length > 0 ? res : null;
  },

  getDistrictByProvinceId: async (id) => {
    const res = await db.get(db.tableName.huyen, "id_tinh", id);
    return res.length > 0 ? res : null;
  },
};
