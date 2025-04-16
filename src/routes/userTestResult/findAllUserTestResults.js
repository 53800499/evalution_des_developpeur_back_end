const { UserTestResult, UserTest } = require("../../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/usertestresults", async (req, res) => {
    try {
      const { user_test_id, error_type } = req.query;
      const limit = parseInt(req.query.limit) || 100;
      
      // Construction du filtre de recherche
      let where = {};
      
      if (user_test_id) {
        where.user_test_id = user_test_id;
      }
      
      if (error_type) {
        where.error_type = error_type;
      }
      
      // Récupération des résultats de test
      const userTestResults = await UserTestResult.findAll({
        where,
        limit: limit,
        order: [["created_at", "DESC"]],
        include: {
          model: UserTest,
          attributes: ["id", "user_id", "test_id", "status", "score"]
        }
      });
      
      const message = userTestResults.length > 0 
        ? "La liste des résultats de test a bien été récupérée." 
        : "Aucun résultat de test trouvé.";
      
      res.json({
        message,
        count: userTestResults.length,
        data: userTestResults
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération des résultats de test :", error);
      res.status(500).json({
        message: "Échec de la récupération des résultats de test. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 