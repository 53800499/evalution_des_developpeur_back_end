const bcrypt = require("bcrypt");
const { User } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.post("/api/users", async (req, res) => {
    try {
      const { firstName, lastName, email, password, last_login, is_verified, skills } = req.body;

      // Vérification des champs obligatoires
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
      }

      // Hachage du mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Création de l'utilisateur
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword, // On stocke le mot de passe haché
        last_login: '',
        is_verified: false, 
        skills: []
      });

      res.status(201).json({
        message: `L'utilisateur ${user.firstName} ${user.lastName} a bien été créé.`,
        data: user
      });

    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: "Cet email est déjà utilisé.", data: error });
      }

      console.error("Erreur lors de la création de l'utilisateur :", error);
      res.status(500).json({
        message: "Échec de la création de l'utilisateur. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
};