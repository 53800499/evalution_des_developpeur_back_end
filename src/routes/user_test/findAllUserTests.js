const { UserTest, User, CodeTest } = require('../../db/sequelize');
const { Op } = require("sequelize");
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.get('/api/user-tests', auth, async (req, res) => {
    try {
      // Construire les clauses de filtre si nécessaires
      const whereClause = {};
      
      if (req.query.user_id) {
        whereClause.user_id = req.query.user_id;
      }
      
      if (req.query.test_id) {
        whereClause.test_id = req.query.test_id;
      }
      
      if (req.query.status) {
        const validStatuses = ['pending', 'in_progress', 'completed', 'failed'];
        if (!validStatuses.includes(req.query.status)) {
          return res.status(400).json({
            message: "Le status doit être 'pending', 'in_progress', 'completed' ou 'failed'"
          });
        }
        whereClause.status = req.query.status;
      }
      
      // Récupérer les tests utilisateur avec les relations
      const userTests = await UserTest.findAll({
        where: whereClause,
        order: [['id', 'ASC']],
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
      
      // Construire le message de réponse
      const filters = [];
      if (req.query.user_id) filters.push(`utilisateur ID ${req.query.user_id}`);
      if (req.query.test_id) filters.push(`test ID ${req.query.test_id}`);
      if (req.query.status) filters.push(`statut '${req.query.status}'`);
      
      const filterMessage = filters.length > 0 ? ` (filtré par ${filters.join(' et ')})` : '';
      const message = `La liste des tests utilisateur${filterMessage} a bien été récupérée.`;
      
      res.json({
        message,
        count: userTests.length,
        data: userTests
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des tests utilisateur :", error);
      res.status(500).json({
        message: "Une erreur s'est produite lors de la récupération des tests utilisateur.",
        error: error.message
      });
    }
  });
}; 