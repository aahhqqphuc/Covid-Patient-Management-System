const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createAccount(username, password, role) {
  const passwordHashed = await bcrypt.hash(password, saltRounds);
  const user = {
    user_name: username,
    password: passwordHashed,
    role: role,
    status: 1,
    active: 0,
  };
  return user;
}

async function compare(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

module.exports = { createAccount, compare };
