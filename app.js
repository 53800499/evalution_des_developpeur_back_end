const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { initDb } = require("./src/db/sequelize");

const app = express();
const port = process.env.SERVER_PORT || 3001;

// Middleware
app.use(morgan("dev")).use(bodyParser.json());

// Initialisation de la base de données
initDb();

// Routes
app.get("/ressources/", (req, res) => {
  res.json({ message: "Bienvenue sur notre API !" });
});

// Routes Users
require("./src/routes/user/findAllUsers")(app);
require("./src/routes/user/findUserByPk")(app);
require("./src/routes/user/createUser")(app);
require("./src/routes/user/updateUser")(app);
require("./src/routes/user/deleteUser")(app);
require("./src/routes/user/login")(app);

// Gestion des erreurs 404
app.use(({ res }) => {
  const message = `Impossible de récupérer la ressource demandée`;
  res.status(404).json({ message });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Une erreur est survenue sur le serveur",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Démarrer le serveur
app.listen(port, () =>
  console.log(`Notre app tourne sur http://localhost:${port}`)
);
