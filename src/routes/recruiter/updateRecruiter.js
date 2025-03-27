const auth = require("../../auth/auth");
const updateRecruiter = require("../../controllers/recruiter/updateRecruiter");

module.exports = (app) => {
  app.put("/api/recruiters/:id", auth, updateRecruiter);
}; 