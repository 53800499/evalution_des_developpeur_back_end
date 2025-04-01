const { UserTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const updateUserTest = async (req, res) => {
  try {
    // Validation de l'ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    // Extraction des données de la requête
    const { user_id, test_id, score, start_time, end_time, status, result_details } = req.body;

    // Vérification de l'existence du test utilisateur
    const userTest = await UserTest.findByPk(id);
    if (!userTest) {
      return res.status(404).json({ 
        message: `Aucun test utilisateur trouvé avec l'ID ${id}.` 
      });
    }

    // Préparation des données à mettre à jour
    const updates = {};
    
    if (user_id !== undefined) updates.user_id = user_id;
    if (test_id !== undefined) updates.test_id = test_id;
    
    if (score !== undefined) {
      if (score < 0 || score > 100) {
        return res.status(400).json({
          message: 'Le score doit être compris entre 0 et 100'
        });
      }
      updates.score = score;
    }
    
    if (start_time !== undefined) updates.start_time = start_time;
    if (end_time !== undefined) updates.end_time = end_time;
    
    if (status !== undefined) {
      const validStatuses = ['pending', 'in_progress', 'completed', 'failed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Le status doit être 'pending', 'in_progress', 'completed' ou 'failed'"
        });
      }
      updates.status = status;
    }
    
    if (result_details !== undefined) updates.result_details = result_details;

    // Si aucun champ à mettre à jour
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Aucun champ valide à mettre à jour n'a été fourni."
      });
    }

    // Mise à jour du test utilisateur
    await userTest.update(updates);
    
    // Récupération du test utilisateur mis à jour
    const updatedUserTest = await UserTest.findByPk(id);

    // Réponse
    res.json({
      message: `Le test utilisateur a été mis à jour avec succès.`,
      data: updatedUserTest
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du test utilisateur :", error);

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
      message: "Une erreur est survenue lors de la mise à jour du test utilisateur.",
      error: error.message
    });
  }
};

module.exports = updateUserTest; 