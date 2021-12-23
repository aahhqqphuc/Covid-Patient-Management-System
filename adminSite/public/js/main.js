//-----table minPay----------
$('.btn-change').on('click', function(e) {
    f = e.target.nextElementSibling;
    $(f).toggleClass('d-none');
})

window.addEventListener('DOMContentLoaded', event => {
    const datatablesSimple1 = document.getElementById('product-Statistic-Table');
    if (datatablesSimple1) {
        new simpleDatatables.DataTable(datatablesSimple1);
    }
    
    const datatablesSimple2 = document.getElementById('package-Statistic-Table');
    if (datatablesSimple2) {
        new simpleDatatables.DataTable(datatablesSimple2);
    }
   
    const datatablesSimple3 = document.getElementById('payment-Statistic-Table');
    if (datatablesSimple3) {
        new simpleDatatables.DataTable(datatablesSimple3);
    }
});