const bcrypt = require("bcrypt");
const { User } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation des champs obligatoires
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis (name, email, password, role).",
      });
    }

    // Validation de la force du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      });
    }
    
    // Validation du rôle
    if (!['developer', 'admin', 'recruiter'].includes(role)) {
      return res.status(400).json({
        message: "Le rôle doit être 'developer', 'admin' ou 'recruiter'.",
      });
    }

    // Hachage du mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Création de l'utilisateur
    const userData = {
      unique_id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      last_login: null,
      is_verified: false,
      skills: []
    };

    const user = await User.create(userData);

    // On ne renvoie pas le mot de passe dans la réponse
    const userResponse = {
      id: user.id,
      unique_id: user.unique_id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      last_login: user.last_login,
      skills: user.skills,
      created_at: user.created_at,
    };

    res.status(201).json({
      message: `L'utilisateur ${user.name} a bien été créé avec le rôle ${user.role}.`,
      data: userResponse,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Erreur de validation des données",
        errors: error.errors.map((e) => e.message),
      });
    }

    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Cet email est déjà utilisé.",
      });
    }

    console.error("Erreur lors de la création de l'utilisateur :", error);
    res.status(500).json({
      message:
        "Échec de la création de l'utilisateur. Veuillez réessayer plus tard.",
    });
  }
};

module.exports = createUser;