const auth = require("../../auth/auth");
const createAdmin = require("../../controllers/admin/createAdmin");

module.exports = (app) => {
  app.post("/api/admins", auth, createAdmin);
}; 