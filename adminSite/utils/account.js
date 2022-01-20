const bcrypt = require("bcrypt");
const saltRounds = 10;

async function createAccount(username, password) {
  const passwordHashed = await bcrypt.hash(password, saltRounds);
  const user = {
    user_name: username,
    password: passwordHashed,
    role: "user",
    status: 1,
    active: 0,
  };
  return user;
}
async function createAccountManager(username, password) {
  const passwordHashed = await bcrypt.hash(password, saltRounds);
  const user = {
    user_name: username,
    password: passwordHashed,
    role: "manager",
    status: 1,
    active: 0,
  };
  return user;
}
async function compare(password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
}

module.exports = { createAccount,createAccountManager, compare };
