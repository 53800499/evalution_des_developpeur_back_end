const { UserTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const createUserTest = async (req, res) => {
  try {
    const { user_id, test_id, score, start_time, end_time, status, result_details } = req.body;

    // Validation des champs requis
    if (!user_id || !test_id || !score) {
      return res.status(400).json({
        message: 'Les champs user_id, test_id et score sont requis'
      });
    }

    // Validation du score
    if (score < 0 || score > 100) {
      return res.status(400).json({
        message: 'Le score doit être compris entre 0 et 100'
      });
    }

    // Validation du status
    const validStatuses = ['pending', 'in_progress', 'completed', 'failed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Le status doit être 'pending', 'in_progress', 'completed' ou 'failed'"
      });
    }

    // Création du test utilisateur
    const userTest = await UserTest.create({
      user_id,
      test_id,
      score,
      start_time: start_time || new Date(),
      end_time,
      status: status || 'pending',
      result_details
    });

    const message = `Le test utilisateur a été créé avec succès`;
    res.status(201).json({
      message,
      data: userTest
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
        message: "Un test utilisateur avec cet ID unique existe déjà.",
      });
    }

    console.error("Erreur lors de la création du test utilisateur :", error);
    const message = `Le test utilisateur n'a pas pu être créé. Réessayez dans quelques instants.`;
    res.status(500).json({ message, data: error.message });
  }
};

module.exports = createUserTest; 