const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  token = token.replace(/^Bearer\s+/, "");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
}

module.exports = { auth };
