const auth = require("../../auth/auth");
const createUserTestResult = require("../../controllers/user_test_result/createUserTestResult");

module.exports = (app) => {
  app.post("/api/user-test-results", auth, createUserTestResult);
}; 