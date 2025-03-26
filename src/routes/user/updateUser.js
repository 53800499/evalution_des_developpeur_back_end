const bcrypt = require("bcrypt");
const { User } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");
const auth = require("../../auth/auth");
const updateUser = require("../../controllers/user/updateUser");

module.exports = (app) => {
  app.put("/api/users/:id", updateUser);
};
