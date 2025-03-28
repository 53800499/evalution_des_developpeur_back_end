const auth = require("../../auth/auth");
const updateTest = require("../../controllers/test/updateTest");

module.exports = (app) => {
  app.put("/api/tests/:id", auth, updateTest);
}; 