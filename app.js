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

// Routes Tests
require("./src/routes/test/findAllTests")(app);
require("./src/routes/test/findTestByPk")(app);
require("./src/routes/test/createTest")(app);
require("./src/routes/test/updateTest")(app);
require("./src/routes/test/deleteTest")(app);

// Routes UserTests
require("./src/routes/user_test/findAllUserTests")(app);
require("./src/routes/user_test/findUserTestByPk")(app);
require("./src/routes/user_test/createUserTest")(app);
require("./src/routes/user_test/updateUserTest")(app);
require("./src/routes/user_test/deleteUserTest")(app);

// Routes UserTestResults
require("./src/routes/user_test_result/findAllUserTestResults")(app);
require("./src/routes/user_test_result/findUserTestResultByPk")(app);
require("./src/routes/user_test_result/createUserTestResult")(app);
require("./src/routes/user_test_result/updateUserTestResult")(app);
require("./src/routes/user_test_result/deleteUserTestResult")(app);

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
