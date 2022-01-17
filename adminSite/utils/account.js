const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createAccount(identityNumber) {
  const passwordHashed = await bcrypt.hash(identityNumber, saltRounds);
  const user = {
    username: identityNumber,
    password: passwordHashed,
    role: "user",
    status: 0,
  };
  return user;
}

async function compare(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

module.exports = { createAccount, compare };
