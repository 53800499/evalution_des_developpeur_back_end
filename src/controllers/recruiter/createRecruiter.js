const bcrypt = require("bcrypt");
const { Recruiter } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const createRecruiter = async (req, res) => {
  try {
    const { firstName, lastName, email, password, company, position, phone, website } = req.body;

    // Validation des champs obligatoires
    if (!firstName || !lastName || !email || !password || !company || !position) {
      return res.status(400).json({
        message: "Les champs firstName, lastName, email, password, company et position sont obligatoires.",
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

    // Création du recruteur
    const recruiter = await Recruiter.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      company,
      position,
      phone: phone || null,
      website: website || null,
      last_login: null,
      is_verified: false,
    });

    // On ne renvoie pas le mot de passe dans la réponse
    const recruiterResponse = {
      id: recruiter.id,
      unique_id: recruiter.unique_id,
      firstName: recruiter.firstName,
      lastName: recruiter.lastName,
      email: recruiter.email,
      company: recruiter.company,
      position: recruiter.position,
      phone: recruiter.phone,
      website: recruiter.website,
      is_verified: recruiter.is_verified,
      last_login: recruiter.last_login,
      created_at: recruiter.created_at,
    };

    res.status(201).json({
      message: `Le recruteur ${recruiter.firstName} ${recruiter.lastName} a bien été créé.`,
      data: recruiterResponse,
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

    console.error("Erreur lors de la création du recruteur :", error);
    res.status(500).json({
      message:
        "Échec de la création du recruteur. Veuillez réessayer plus tard.",
    });
  }
};

module.exports = createRecruiter; 