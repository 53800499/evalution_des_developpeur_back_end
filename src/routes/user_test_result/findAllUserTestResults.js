const { UserTestResult, UserTest } = require('../../db/sequelize');
const { Op } = require("sequelize");
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.get('/api/user-test-results', auth, async (req, res) => {
    try {
      // Construire les clauses de filtre si nécessaires
      const whereClause = {};
      
      if (req.query.user_test_id) {
        whereClause.user_test_id = req.query.user_test_id;
      }
      
      if (req.query.error_type) {
        whereClause.error_type = req.query.error_type;
      }
      
      // Récupérer les résultats de tests utilisateur avec les relations
      const userTestResults = await UserTestResult.findAll({
        where: whereClause,
        order: [['id', 'ASC']],
        include: [
          {
            model: UserTest,
            as: 'userTest',
            attributes: ['id', 'unique_id', 'user_id', 'test_id', 'score', 'status']
          }
        ]
      });
      
      // Construire le message de réponse
      const filters = [];
      if (req.query.user_test_id) filters.push(`test utilisateur ID ${req.query.user_test_id}`);
      if (req.query.error_type) filters.push(`type d'erreur '${req.query.error_type}'`);
      
      const filterMessage = filters.length > 0 ? ` (filtré par ${filters.join(' et ')})` : '';
      const message = `La liste des résultats de tests${filterMessage} a bien été récupérée.`;
      
      res.json({
        message,
        count: userTestResults.length,
        data: userTestResults
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des résultats de tests :", error);
      res.status(500).json({
        message: "Une erreur s'est produite lors de la récupération des résultats de tests.",
        error: error.message
      });
    }
  });
}; 