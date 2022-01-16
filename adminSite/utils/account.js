const bcrypt = require("bcrypt");
const passport = require("passport");
const saltRounds = 10;

async function createAccount(identityNumber) {
  const passwordHashed = await bcrypt.hash(identityNumber, saltRounds);
  const user = {
    user_name: identityNumber,
    password: passwordHashed,
    role: "user",
    status: 0,
  };
  return user;
}

module.exports = { createAccount };
