const { UserTestResult, UserTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const updateUserTestResult = async (req, res) => {
  try {
    // Validation de l'ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    // Extraction des données de la requête
    const { user_test_id, error_type, line_number, suggestion, execution_time } = req.body;

    // Vérification de l'existence du résultat de test
    const userTestResult = await UserTestResult.findByPk(id);
    if (!userTestResult) {
      return res.status(404).json({ 
        message: `Aucun résultat de test trouvé avec l'ID ${id}.` 
      });
    }

    // Vérification du test utilisateur si modifié
    if (user_test_id !== undefined) {
      const userTest = await UserTest.findByPk(user_test_id);
      if (!userTest) {
        return res.status(404).json({
          message: `Aucun test utilisateur trouvé avec l'ID ${user_test_id}.`
        });
      }
    }

    // Préparation des données à mettre à jour
    const updates = {};
    
    if (user_test_id !== undefined) updates.user_test_id = user_test_id;
    if (error_type !== undefined) updates.error_type = error_type;
    
    if (line_number !== undefined) {
      if (line_number < 1) {
        return res.status(400).json({
          message: 'Le numéro de ligne doit être supérieur à 0'
        });
      }
      updates.line_number = line_number;
    }
    
    if (suggestion !== undefined) updates.suggestion = suggestion;
    
    if (execution_time !== undefined) {
      if (execution_time < 0) {
        return res.status(400).json({
          message: 'Le temps d\'exécution doit être positif ou nul'
        });
      }
      updates.execution_time = execution_time;
    }

    // Si aucun champ à mettre à jour
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Aucun champ valide à mettre à jour n'a été fourni."
      });
    }

    // Mise à jour du résultat de test
    await userTestResult.update(updates);
    
    // Récupération du résultat de test mis à jour
    const updatedUserTestResult = await UserTestResult.findByPk(id);

    // Réponse
    res.json({
      message: `Le résultat de test a été mis à jour avec succès.`,
      data: updatedUserTestResult
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du résultat de test :", error);

    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Erreur de validation des données",
        errors: error.errors.map(e => e.message)
      });
    }

    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Une contrainte d'unicité n'a pas été respectée."
      });
    }

    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour du résultat de test.",
      error: error.message
    });
  }
};

module.exports = updateUserTestResult; 