const { User } = require('../../db/sequelize');
const auth = require("../../auth/auth");
const { ValidationError, UniqueConstraintError } = require('sequelize');
const bcrypt = require('bcrypt');
const updateUser = require("../../controllers/user/updateUser");

module.exports = (app) => {
  app.put("/api/users/:id", auth, updateUser);
};
