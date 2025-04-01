const auth = require("../../auth/auth");
const createUserTest = require("../../controllers/user_test/createUserTest");

module.exports = (app) => {
  app.post("/api/user-tests", auth, createUserTest);
}; 