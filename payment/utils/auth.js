const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.cookies.jwt;

  console.log(token);

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

module.exports.auth = auth;
