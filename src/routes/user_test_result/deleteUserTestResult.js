const { UserTestResult } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.delete('/api/user-test-results/:id', auth, async (req, res) => {
    try {
      // Validation de l'ID
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
      }
      
      // Vérification de l'existence du résultat de test
      const userTestResult = await UserTestResult.findByPk(id);
      if (!userTestResult) {
        return res.status(404).json({ 
          message: `Aucun résultat de test trouvé avec l'ID ${id}.` 
        });
      }
      
      // Suppression du résultat de test
      await userTestResult.destroy();
      
      // Réponse
      res.json({ 
        message: `Le résultat de test avec l'ID ${id} a été supprimé avec succès.` 
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du résultat de test :", error);
      res.status(500).json({ 
        message: "Une erreur est survenue lors de la suppression du résultat de test.", 
        error: error.message 
      });
    }
  });
}; 