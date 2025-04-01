const auth = require("../../auth/auth");
const updateUserTest = require("../../controllers/user_test/updateUserTest");

module.exports = (app) => {
  app.put("/api/user-tests/:id", auth, updateUserTest);
}; 