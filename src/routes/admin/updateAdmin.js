const auth = require("../../auth/auth");
const updateAdmin = require("../../controllers/admin/updateAdmin");

module.exports = (app) => {
  app.put("/api/admins/:id", auth, updateAdmin);
}; 