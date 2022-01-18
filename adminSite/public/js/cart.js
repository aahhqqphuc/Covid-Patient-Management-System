var fadeTime = 100;

/* Assign actions */
$(document).on("change", '.product-quantity input', function () {
  updateQuantityPrice(this);
});

/* Recalculate cart */
function recalculateCart() {
  var subtotal = 0;

  /* Sum up row totals */
  $('.product').each(function () {
    subtotal += parseFloat($(this).children('.product-line-price').text());
  });


  /* Update totals display */
  $('.totals-value').fadeOut(fadeTime, function () {
    $('#cart-subtotal').html(subtotal);
    if (subtotal == 0) {
      $('.checkout').fadeOut(fadeTime);
    } else {
      $('.checkout').fadeIn(fadeTime);
    }
    $('.totals-value').fadeIn(fadeTime);
  });
}


/* Update quantity */
function updateQuantityPrice(quantityInput) {
  /* Calculate line price */
  var productRow = $(quantityInput).parent().parent();
  var price = parseFloat(productRow.children('.product-price').text());
  var quantity = $(quantityInput).val();
  var linePrice = price * quantity;

  /* Update line price display and recalc cart totals */
  productRow.children('.product-line-price').each(function () {
    $(this).fadeOut(fadeTime, function () {
      $(this).text(linePrice);
      recalculateCart();
      $(this).fadeIn(fadeTime);
    });
  });
}

// ---------------------------------------------------
// const html =`<div class="product">
// <div class="product-image">
//     <img src="https://s.cdpn.io/3/dingo-dog-bones.jpg">
// </div>
// <div class="product-details">
//     <h5 class="product-title">Dingo Dog Bones</h5>
//     <p class="product-description" style="text-align:justify">The best dog bones of all time. Holy crap. Your dog
//         will
//         be begging for these things! I got curious once and ate one myself. I'm a fan.
//     </p>
// </div>
// <div class="product-price mt-1">25000</div>
// <div class="product-quantity">
//   <span><i class="fas fa-minus decrease"></i></span>
//   <input type="number" name="product1" value="2" min="1" max="5">
//   <span><i class="fas fa-plus increase"></i></span>
// </div>
// <div class="product-line-price mt-1">50000</div>
// </div>

// <div class="product">
// <div class="product-image">
//     <img src="https://s.cdpn.io/3/large-NutroNaturalChoiceAdultLambMealandRiceDryDogFood.png"
//         alt="Ảnh sản phẩm" />
// </div>
// <div class="product-details">
//     <h5 class="product-title">Nutro™ Adult Lamb and Rice Dog Food</h5>
//     <p class="product-description" style="text-align:justify">Who doesn't like lamb and rice? We've all hit the
//         halal
//         cart at 3am while quasi-blackout after a night of binge drinking in Manhattan.
//         Now
//         it's your dog's turn!</p>
// </div>
// <div class="product-price mt-1">45000</div>
// <div class="product-quantity">
//   <span><i class="fas fa-minus decrease"></i></span>
//   <input type="number" name="product2" value="2" min="0" max="3">
//   <span><i class="fas fa-plus increase"></i></span>
// </div>
// <div class="product-line-price mt-1">45000</div>
// </div>`


$(document).on('click', '.decrease', function () {
  updateQuantity(this, 0);
})

$(document).on('click', '.increase', function () {
  updateQuantity(this, 1);
})

function updateQuantity(e, opt) {
  const input = $(e).parent().parent().children()[1];
  const quantityNode = $(input);
  let quantity = parseInt(quantityNode.val());
  const min = parseInt(quantityNode.attr('min'),);
  const max = parseInt(quantityNode.attr('max'));

  if (opt == 0) {
    if (quantity > min) {
      quantity = quantity - 1;
      quantityNode.val(quantity);
    }
  } else {
    if (quantity < max) {
      quantity = quantity + 1;
      quantityNode.val(quantity);
    }
  }

  updateQuantityPrice(quantityNode);
}


$('.btn-request-form').on("click", async function (e) {
  nodeId = $(e.target)[0].nextElementSibling;
  const id = $(nodeId).val();

  try {
    const data = await fetch(`http://127.0.0.1:3000/product-package/package-detail/${id}`)
    const package = await data.json();
    const info = package.info[0];

    $('form input[name="packageId"]').val(`${info.id_goi_nhu_yeu_pham}`);
    $('.cart .package-name').text(`${info.ten_goi}`)
    
    let html = '';

    package.products.forEach(e => {
      const tong_tien = e.gia_tien * e.so_luong;

      let so_luong = e.so_luong > e.gioi_han_san_pham? e.gioi_han_san_pham : e.so_luong;

      html += `<div class="product">
      <div class="product-image">
          <img src="${e.url}">
      </div>
      <div class="product-details">
          <h5 class="product-title">${e.ten_sanpham}</h5>
          <p class="product-description" style="text-align:justify">${e.mo_ta}</p>
      </div>
      <div class="product-price mt-1">${e.gia_tien}</div>
      <div class="product-quantity d-flex justify-content-center align-items-center">
        <span><i class="fas fa-minus decrease"></i></span>
        <input type="number" name="product[]" value="${so_luong}" min="0" max="${e.gioi_han_san_pham}">
        <span><i class="fas fa-plus increase"></i></span>
      </div>
      <div class="product-line-price mt-1">${tong_tien}</div>
      </div>`

    })

    $('.shopping-cart .list-product').html(html);
    recalculateCart();
    $('.shopping-cart .totals').removeClass('d-none');
  } catch (error) {
    $('.shopping-cart .list-product').html('<h3 class="text-center text-secondary my-4">Lỗi rồi !!!</h3>');
    $('.shopping-cart .totals').addClass('d-none');
    console.log(error);
  }

})