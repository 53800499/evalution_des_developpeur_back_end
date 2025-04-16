const bcrypt = require("bcrypt");
const { Recruiter } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.post("/api/recruiters", async (req, res) => {
    try {
      const { email, password, name, company_name, last_login, is_verified } = req.body;

      // Vérification des champs obligatoires
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
      }

      // Hachage du mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Création de l'utilisateur
      const recruiter = await Recruiter.create({
        email,
        password: hashedPassword, // On stocke le mot de passe haché
        name,
        company_name:'',
        last_login: '',
        is_verified: false
      });

      res.status(201).json({
        message: `Le Recruteur ${recruiter.name} a bien été créé.`,
        data: recruiter
      });

    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: "Cet email est déjà utilisé.", data: error });
      }

      console.error("Erreur lors de la création du recruteur :", error);
      res.status(500).json({
        message: "Échec de la création de l'utilisateur. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
};