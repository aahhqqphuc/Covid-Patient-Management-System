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
          if (response.active) {
            location.href = "/product-package";
          } else {
            location.href = "/account/change-patient-pwd";
          }
        } else if (response.role == "admin") {
          location.href = "/admin";
        } else {
          location.href = "/patient";
        }
      } else {
        $("#alert-msg").text(response.msg);
        $("#alert").attr("hidden", true);
        return;
      }
    },
    error: function (response) {
      alert("server error");
    },
  });
});
