require('dotenv').config();
const express = require("express")
const morgan = require("morgan")
const cors = require("cors");
const bodyParser = require("body-parser")
const { initDb } = require("./src/db/sequelize") 
const auth = require("./src/auth/auth");

const app = express();
const port = process.env.SERVER_PORT || 3003;
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",");
const OpenAI = require("openai");

// Initialisation de l'API OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

// Configuration CORS
app.use(
  cors({
    origin: function(origin, callback) {
      // Autorise les requêtes sans origin (comme curl ou mobile apps)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Middleware
app.use(morgan("dev")).use(bodyParser.json());

app.use(express.json());

// Initialisation de la base de données
initDb();

// Routes (exemple basique)
app.get("/ressources/", (req, res) => {
  res.json({ message: "Bienvenue sur notre API !" });
});

// : Users

require("./src/routes/user/findAllUsers")(app);
require("./src/routes/user/findUserByPk")(app);
require("./src/routes/user/createUser")(app);
require("./src/routes/user/updateUser")(app);
require("./src/routes/user/deleteUser")(app);
require("./src/routes/user/login")(app);
require("./src/auth/verifyAuth")(app);

// : Recruiter

require("./src/routes/recruiter/createRecruiter")(app);
require("./src/routes/recruiter/findAllRecruiter")(app);
require("./src/routes/recruiter/findRecruiterByPk")(app);
require("./src/routes/recruiter/updateRecruiter")(app);
require("./src/routes/recruiter/deleteRecruiter")(app);
require("./src/routes/recruiter/login")(app);

// : Admin
require("./src/routes/admin/createAdmin")(app);
require("./src/routes/admin/findAllAdmin")(app);
require("./src/routes/admin/findAdminByPk")(app);
require("./src/routes/admin/updateAdmin")(app);
require("./src/routes/admin/deleteAdmin")(app);
require("./src/routes/admin/login")(app);

// : IA
require("./src/routes/ia/analyse")(app, openai);

app.use(({ res } ) => {
    const message = `Impossible de récupérer la ressource demandée`
    res.status(404).json({message})
})

// Démarrer le serveur
app.listen(port, () => console.log(`Notre app tourne sur http://localhost:${port}`))