const bcrypt = require("bcrypt");
const { User } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation des champs obligatoires
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis.",
      });
    }

    // Validation de la force du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      });
    }

    // Hachage du mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Création de l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      last_login: null,
      is_verified: false,
      skills: [],
    });

    // On ne renvoie pas le mot de passe dans la réponse
    const userResponse = {
      id: user.id,
      unique_id: user.unique_id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      is_verified: user.is_verified,
      last_login: user.last_login,
      skills: user.skills,
      created_at: user.created_at,
    };

    res.status(201).json({
      message: `L'utilisateur ${user.firstName} ${user.lastName} a bien été créé.`,
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
