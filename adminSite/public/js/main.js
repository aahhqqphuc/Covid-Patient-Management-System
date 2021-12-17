$('.btn-change').on('click', function(e) {
    f = e.target.nextElementSibling;
    $(f).toggleClass('d-none');
})