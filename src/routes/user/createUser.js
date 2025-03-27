const createUser = require("../../controllers/user/createUser");

module.exports = (app) => {
  app.post("/api/users", createUser);
};