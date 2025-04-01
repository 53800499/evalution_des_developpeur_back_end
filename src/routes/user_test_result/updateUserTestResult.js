const auth = require("../../auth/auth");
const updateUserTestResult = require("../../controllers/user_test_result/updateUserTestResult");

module.exports = (app) => {
  app.put("/api/user-test-results/:id", auth, updateUserTestResult);
}; 