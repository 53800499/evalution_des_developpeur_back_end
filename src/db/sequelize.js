require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/user");
const CodeTestModel = require("../models/code_test");
const UserTestModel = require("../models/user_test");
const UserTestResultModel = require("../models/user_test_result");

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mariadb",
    dialectOptions: {
      timezone: "Etc/GMT-2",
      connectTimeout: 60000
    },
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const User = UserModel(sequelize, DataTypes);
const CodeTest = CodeTestModel(sequelize, DataTypes);
const UserTest = UserTestModel(sequelize, DataTypes);
const UserTestResult = UserTestResultModel(sequelize, DataTypes);

// Définition des relations
UserTest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserTest.belongsTo(CodeTest, { foreignKey: 'test_id', as: 'test' });
UserTestResult.belongsTo(UserTest, { foreignKey: 'user_test_id', as: 'userTest' });

User.hasMany(UserTest, { foreignKey: 'user_id', as: 'userTests' });
CodeTest.hasMany(UserTest, { foreignKey: 'test_id', as: 'userTests' });
UserTest.hasMany(UserTestResult, { foreignKey: 'user_test_id', as: 'testResults' });

const initDb = async () => {
  try {
    // Test de la connexion
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    
    // Synchronisation sans effacer les données existantes
    await sequelize.sync();
    console.log("La base de données a bien été initialisée !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
    // Afficher plus de détails sur l'erreur
    console.error("Détails de l'erreur :", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
  }
};

module.exports = {
  initDb,
  User,
  CodeTest,
  UserTest,
  UserTestResult
};
