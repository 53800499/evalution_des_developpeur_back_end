const { UserTestResult, UserTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const createUserTestResult = async (req, res) => {
  try {
    const { user_test_id, error_type, line_number, suggestion, execution_time } = req.body;

    // Validation des champs requis
    if (!user_test_id || !error_type || !line_number || execution_time === undefined) {
      return res.status(400).json({
        message: 'Les champs user_test_id, error_type, line_number et execution_time sont requis'
      });
    }

    // Vérification que le test utilisateur existe
    const userTest = await UserTest.findByPk(user_test_id);
    if (!userTest) {
      return res.status(404).json({
        message: `Aucun test utilisateur trouvé avec l'ID ${user_test_id}`
      });
    }

    // Validation du numéro de ligne
    if (line_number < 1) {
      return res.status(400).json({
        message: 'Le numéro de ligne doit être supérieur à 0'
      });
    }

    // Validation du temps d'exécution
    if (execution_time < 0) {
      return res.status(400).json({
        message: 'Le temps d\'exécution doit être positif ou nul'
      });
    }

    // Création du résultat de test
    const userTestResult = await UserTestResult.create({
      user_test_id,
      error_type,
      line_number,
      suggestion,
      execution_time
    });

    const message = `Le résultat de test a été créé avec succès`;
    res.status(201).json({
      message,
      data: userTestResult
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
        message: "Un résultat de test avec cet ID unique existe déjà.",
      });
    }

    console.error("Erreur lors de la création du résultat de test :", error);
    const message = `Le résultat de test n'a pas pu être créé. Réessayez dans quelques instants.`;
    res.status(500).json({ message, data: error.message });
  }
};

module.exports = createUserTestResult; 