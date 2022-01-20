//-----table minPay----------
$(".btn-change").on("click", function (e) {
  f = e.target.nextElementSibling;
  $(f).toggleClass("d-none");
});

window.addEventListener("DOMContentLoaded", (event) => {
  const datatablesSimple1 = document.getElementById("product-Statistic-Table");
  if (datatablesSimple1) {
    new simpleDatatables.DataTable(datatablesSimple1);
  }

  const datatablesSimple2 = document.getElementById("package-Statistic-Table");
  if (datatablesSimple2) {
    new simpleDatatables.DataTable(datatablesSimple2);
  }

  const datatablesSimple3 = document.getElementById("payment-Statistic-Table");
  if (datatablesSimple3) {
    new simpleDatatables.DataTable(datatablesSimple3);
  }

  const datatablesSimple4 = document.getElementById("payment-Managerment-Table");
  if (datatablesSimple4) {
    new simpleDatatables.DataTable(datatablesSimple4);
  }
});
window.addEventListener("DOMContentLoaded", (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector("#sidebarToggle");
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener("click", (event) => {
      event.preventDefault();
      document.body.classList.toggle("sb-sidenav-toggled");
      localStorage.setItem("sb|sidebar-toggle", document.body.classList.contains("sb-sidenav-toggled"));
    });
  }
});
