const auth = require("../../auth/auth");
const createTest = require("../../controllers/test/createTest");

module.exports = (app) => {
  app.post("/api/tests", auth, createTest);
}; 