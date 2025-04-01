const { UserTestResult, UserTest } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.get('/api/user-test-results/:id', auth, async (req, res) => {
    try {
      // Validation de l'ID
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
      }
      
      // Récupération du résultat de test avec les relations
      const userTestResult = await UserTestResult.findByPk(id, {
        include: [
          {
            model: UserTest,
            as: 'userTest',
            attributes: ['id', 'unique_id', 'user_id', 'test_id', 'score', 'status']
          }
        ]
      });
      
      // Vérification de l'existence du résultat de test
      if (!userTestResult) {
        return res.status(404).json({ 
          message: `Aucun résultat de test trouvé avec l'ID ${id}.` 
        });
      }
      
      // Réponse
      const message = 'Le résultat de test a bien été trouvé.';
      res.json({ message, data: userTestResult });
    } catch (error) {
      console.error("Erreur lors de la recherche du résultat de test :", error);
      res.status(500).json({ 
        message: "Une erreur est survenue lors de la recherche du résultat de test.", 
        error: error.message 
      });
    }
  });
}; 