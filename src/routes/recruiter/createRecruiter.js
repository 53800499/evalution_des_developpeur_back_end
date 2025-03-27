const auth = require("../../auth/auth");
const createRecruiter = require("../../controllers/recruiter/createRecruiter");

module.exports = (app) => {
  app.post("/api/recruiters", auth, createRecruiter);
}; 