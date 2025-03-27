const bcrypt = require("bcrypt");
const { Admin } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const updateAdmin = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { firstName, lastName, email, password } = req.body;

    // Vérifier si l'administrateur existe
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "L'administrateur n'existe pas." });
    }

    // Vérifier si l'email est déjà utilisé par un autre administrateur
    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({
          message: "Cet email est déjà utilisé par un autre administrateur.",
        });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {
      firstName: firstName || admin.firstName,
      lastName: lastName || admin.lastName,
      email: email || admin.email,
    };

    // Si un nouveau mot de passe est fourni, le hasher
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Mettre à jour l'administrateur
    await admin.update(updateData);

    // Préparer la réponse sans le mot de passe
    const adminResponse = {
      id: admin.id,
      unique_id: admin.unique_id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      is_verified: admin.is_verified,
      last_login: admin.last_login,
      updated_at: admin.updated_at,
    };

    res.json({
      message: "L'administrateur a été mis à jour avec succès.",
      data: adminResponse,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Erreur de validation des données",
        errors: error.errors.map((e) => e.message),
      });
    }

    console.error("Erreur lors de la mise à jour de l'administrateur :", error);
    res.status(500).json({
      message:
        "Échec de la mise à jour de l'administrateur. Veuillez réessayer plus tard.",
    });
  }
};

module.exports = updateAdmin; 