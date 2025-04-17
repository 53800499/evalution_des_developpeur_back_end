require('dotenv').config()
const { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('../models/user')
const RecruiterModel = require('../models/recruiter')
const AdminModel = require("../models/admin")
const ProgrammingLanguageModel = require('../models/programmingLanguage')
const CodeTestModel = require('../models/codeTest')
const UserTestModel = require('../models/userTest')
const UserTestResultModel = require('../models/userTestResult')
const PlagiarismResultModel = require('../models/plagiarismResult')

// Connexion sécurisée avec des variables d'environnement
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})

const User = UserModel(sequelize, DataTypes)
const Recruiter = RecruiterModel(sequelize, DataTypes)
const Admin = AdminModel(sequelize, DataTypes)
const ProgrammingLanguage = ProgrammingLanguageModel(sequelize, DataTypes)
const CodeTest = CodeTestModel(sequelize, DataTypes)
const UserTest = UserTestModel(sequelize, DataTypes)
const UserTestResult = UserTestResultModel(sequelize, DataTypes)
const PlagiarismResult = PlagiarismResultModel(sequelize, DataTypes)

// Définition des relations
// CodeTest → ProgrammingLanguage (1:N)
CodeTest.belongsTo(ProgrammingLanguage, { foreignKey: 'language_id' })
ProgrammingLanguage.hasMany(CodeTest, { foreignKey: 'language_id' })

// User → UserTest (1:N)
User.hasMany(UserTest, { foreignKey: 'user_id' })
UserTest.belongsTo(User, { foreignKey: 'user_id' })

// CodeTest → UserTest (1:N)
CodeTest.hasMany(UserTest, { foreignKey: 'test_id' })
UserTest.belongsTo(CodeTest, { foreignKey: 'test_id' })

// UserTest → UserTestResult (1:N)
UserTest.hasMany(UserTestResult, { foreignKey: 'user_test_id' })
UserTestResult.belongsTo(UserTest, { foreignKey: 'user_test_id' })

// UserTest → PlagiarismResult (1:N)
UserTest.hasMany(PlagiarismResult, { foreignKey: 'user_test_id' })
PlagiarismResult.belongsTo(UserTest, { foreignKey: 'user_test_id' })

const initDb = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log('La base de données a bien été initialisée !')
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error)
  }
}

module.exports = { 
  initDb, User, Recruiter, Admin, ProgrammingLanguage, CodeTest, 
  UserTest, UserTestResult, PlagiarismResult
}