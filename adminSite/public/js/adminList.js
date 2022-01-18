window.addEventListener("DOMContentLoaded", (event) => {


  const datatablesSimple1 = document.getElementById("AccountTable");
  if (datatablesSimple1) {
    new simpleDatatables.DataTable(datatablesSimple1);
  }
  const datatablesSimple2 = document.getElementById("action_log");
  if (datatablesSimple2) {
    new simpleDatatables.DataTable(datatablesSimple2);
  }
});
