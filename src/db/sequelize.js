require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("../models/user");

// Connexion sécurisée avec des variables d'environnement
const sequelize = new Sequelize("hlab", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  dialectOptions: {
    timezone: "Etc/GMT-2",
  },
  logging: false,
});

const User = UserModel(sequelize, DataTypes);

const initDb = async () => {
  try {
    // Synchronisation sans effacer les données existantes
    await sequelize.sync();
    console.log("La base de données a bien été initialisée !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
  }
};

module.exports = {
  initDb,
  User,
};
