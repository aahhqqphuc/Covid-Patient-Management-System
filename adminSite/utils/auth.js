const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect("/");
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
}

function authLogin(req, res, next) {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = verified;

      if (req.user.role == "user") {
        return res.redirect("/product");
      } else if (req.user.role == "admin") {
        return res.redirect("/admin");
      } else {
        return res.redirect("/product-package");
      }
    } catch (error) {
      return res.status(401).send("Invalid token");
    }
  }
  next();
}

module.exports = { auth, authLogin };
