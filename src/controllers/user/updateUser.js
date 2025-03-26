const bcrypt = require("bcrypt");
const { User } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas." });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          message: "Cet email est déjà utilisé par un autre utilisateur.",
        });
      }
    }

    // Préparer les données à mettre à jour
    const updateData = {
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      email: email || user.email,
    };

    // Si un nouveau mot de passe est fourni, le hasher
    if (password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(password, saltRounds);
    }

    // Mettre à jour l'utilisateur
    await user.update(updateData);

    // Préparer la réponse sans le mot de passe
    const userResponse = {
      id: user.id,
      unique_id: user.unique_id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      is_verified: user.is_verified,
      last_login: user.last_login,
      skills: user.skills,
      updated_at: user.updated_at,
    };

    res.json({
      message: "L'utilisateur a été mis à jour avec succès.",
      data: userResponse,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Erreur de validation des données",
        errors: error.errors.map((e) => e.message),
      });
    }

    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({
      message:
        "Échec de la mise à jour de l'utilisateur. Veuillez réessayer plus tard.",
    });
  }
};

module.exports = updateUser;
