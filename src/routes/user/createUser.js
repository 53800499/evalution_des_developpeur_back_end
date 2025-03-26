const bcrypt = require("bcrypt");
const { User } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");
const createUser = require("../../controllers/user/createUser");

module.exports = (app) => {
  app.post("/api/users", createUser);
};