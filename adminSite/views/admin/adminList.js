window.addEventListener("DOMContentLoaded", (event) => {
  // Simple-DataTables
  // https://github.com/fiduswriter/Simple-DataTables/wiki

  const datatablesSimple1 = document.getElementById("AccountTable");
  if (datatablesSimple1) {
    new simpleDatatables.DataTable(datatablesSimple1);
  }
});
