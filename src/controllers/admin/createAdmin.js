const bcrypt = require("bcrypt");
const { Admin } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation des champs obligatoires
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "Les champs firstName, lastName, email et password sont obligatoires.",
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

    // Création de l'administrateur
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      last_login: null,
      is_verified: false,
    });

    // On ne renvoie pas le mot de passe dans la réponse
    const adminResponse = {
      id: admin.id,
      unique_id: admin.unique_id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      is_verified: admin.is_verified,
      last_login: admin.last_login,
      created_at: admin.created_at,
    };

    res.status(201).json({
      message: `L'administrateur ${admin.firstName} ${admin.lastName} a bien été créé.`,
      data: adminResponse,
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

    console.error("Erreur lors de la création de l'administrateur :", error);
    res.status(500).json({
      message:
        "Échec de la création de l'administrateur. Veuillez réessayer plus tard.",
    });
  }
};

module.exports = createAdmin; 