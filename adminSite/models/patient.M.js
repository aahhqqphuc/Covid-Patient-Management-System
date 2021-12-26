const db = require("./db");

const tbName = "benh_nhan_covid";
const idFieldName = "id_benh_nhan";

module.exports = {
  all: async () => {
    const res = await db.viewPatientsList();
    return res;
  },
  get_patient: async (id) => {
    const res = await db.get(tbName, idFieldName, id);
    return res;
  },
  detail_treatHis: async (id) => {
    const res = await db.viewPatientsDetail_TreatmentHis(id);
    res.forEach(element=>{
      element.ngay_di_chuyen = "Ngày " + element.ngay_di_chuyen.getDate() + " Tháng " + element.ngay_di_chuyen.getMonth() + " Năm " + element.ngay_di_chuyen.getFullYear()  ;
      element.ngay_cap_nhat = "Ngày " + element.ngay_cap_nhat.getDate() + " Tháng " + element.ngay_cap_nhat.getMonth() + " Năm " + element.ngay_cap_nhat.getFullYear()  ;
    })
    return res;
  },
  viewPatientsDetail_PatientTrailDown: async (id) => {
    const res = await db.viewPatientsDetail_PatientTrailDown(id);
    
    return res;
  },
  viewPatientsDetail_PatientTrailUp: async (id) => {
    const res = await db.viewPatientsDetail_PatientTrailUp(id);
    
    return res;
  },
};
