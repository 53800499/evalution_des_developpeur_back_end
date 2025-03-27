const bcrypt = require("bcrypt");
const { Recruiter } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const updateRecruiter = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    const { firstName, lastName, email, password, company, position, phone, website } = req.body;

    // Vérifier si le recruteur existe
    const recruiter = await Recruiter.findByPk(recruiterId);
    if (!recruiter) {
      return res.status(404).json({ message: "Le recruteur n'existe pas." });
    }

    // Vérifier si l'email est déjà utilisé par un autre recruteur
    if (email && email !== recruiter.email) {
      const existingRecruiter = await Recruiter.findOne({ where: { email } });
      if (existingRecruiter) {
        return res.status(400).json({
          message: "Cet email est déjà utilisé par un autre recruteur.",
        });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {
      firstName: firstName || recruiter.firstName,
      lastName: lastName || recruiter.lastName,
      email: email || recruiter.email,
      company: company || recruiter.company,
      position: position || recruiter.position,
      phone: phone !== undefined ? phone : recruiter.phone,
      website: website !== undefined ? website : recruiter.website,
    };

    // Si un nouveau mot de passe est fourni, le hasher
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Mettre à jour le recruteur
    await recruiter.update(updateData);

    // Préparer la réponse sans le mot de passe
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
      updated_at: recruiter.updated_at,
    };

    res.json({
      message: "Le recruteur a été mis à jour avec succès.",
      data: recruiterResponse,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Erreur de validation des données",
        errors: error.errors.map((e) => e.message),
      });
    }

    console.error("Erreur lors de la mise à jour du recruteur :", error);
    res.status(500).json({
      message:
        "Échec de la mise à jour du recruteur. Veuillez réessayer plus tard.",
    });
  }
};

module.exports = updateRecruiter; 