$("#login-form").submit(function (e) {
  e.preventDefault();

  $.ajax({
    url: "/account/login",
    method: "post",
    data: {
      username: $("#username").val(),
      password: $("#password").val(),
    },
    success: function (response) {
      if (response.success) {
        const d = new Date();
        d.setTime(d.getTime() + response.expiresIn * 1000);
        let expires = "expires=" + d.toUTCString();
        document.cookie = "jwt =" + response.msg + ";" + expires + ";path=/";

        if (response.role == "user") {
          console.log("fđf");
          location.href = "/product";
        } else if (response.role == "admin") {
          location.href = "/admin";
        } else {
          location.href = "/product-package";
        }
      } else {
        $("#alert").text(response.msg);
        $("#alert").attr("hidden", true);
      }
    },
    error: function (response) {
      alert("server error");
    },
  });
});
