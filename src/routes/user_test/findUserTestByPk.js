const { UserTest, User, CodeTest } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.get('/api/user-tests/:id', auth, async (req, res) => {
    try {
      // Validation de l'ID
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
      }
      
      // Récupération du test utilisateur avec les relations
      const userTest = await UserTest.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'unique_id', 'name', 'email', 'role']
          },
          {
            model: CodeTest,
            as: 'test',
            attributes: ['id', 'unique_id', 'name', 'description', 'difficulty', 'category', 'duration']
          }
        ]
      });
      
      // Vérification de l'existence du test utilisateur
      if (!userTest) {
        return res.status(404).json({ 
          message: `Aucun test utilisateur trouvé avec l'ID ${id}.` 
        });
      }
      
      // Réponse
      const message = 'Le test utilisateur a bien été trouvé.';
      res.json({ message, data: userTest });
    } catch (error) {
      console.error("Erreur lors de la recherche du test utilisateur :", error);
      res.status(500).json({ 
        message: "Une erreur est survenue lors de la recherche du test utilisateur.", 
        error: error.message 
      });
    }
  });
}; 