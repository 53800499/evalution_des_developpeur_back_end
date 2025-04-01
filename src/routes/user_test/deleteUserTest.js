const { UserTest } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.delete('/api/user-tests/:id', auth, async (req, res) => {
    try {
      // Validation de l'ID
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
      }
      
      // Vérification de l'existence du test utilisateur
      const userTest = await UserTest.findByPk(id);
      if (!userTest) {
        return res.status(404).json({ 
          message: `Aucun test utilisateur trouvé avec l'ID ${id}.` 
        });
      }
      
      // Suppression du test utilisateur
      await userTest.destroy();
      
      // Réponse
      res.json({ 
        message: `Le test utilisateur avec l'ID ${id} a été supprimé avec succès.` 
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du test utilisateur :", error);
      res.status(500).json({ 
        message: "Une erreur est survenue lors de la suppression du test utilisateur.", 
        error: error.message 
      });
    }
  });
}; 