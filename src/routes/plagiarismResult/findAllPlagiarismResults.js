const { PlagiarismResult, UserTest } = require("../../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/plagiarismresults", async (req, res) => {
    try {
      const { user_test_id } = req.query;
      const limit = parseInt(req.query.limit) || 100;
      
      // Construction du filtre de recherche
      let where = {};
      
      if (user_test_id) {
        where.user_test_id = user_test_id;
      }
      
      // Récupération des résultats de plagiat
      const plagiarismResults = await PlagiarismResult.findAll({
        where,
        limit: limit,
        order: [["created_at", "DESC"]],
        include: {
          model: UserTest,
          attributes: ["id", "user_id", "test_id", "status", "score"]
        }
      });
      
      const message = plagiarismResults.length > 0 
        ? "La liste des résultats de plagiat a bien été récupérée." 
        : "Aucun résultat de plagiat trouvé.";
      
      res.json({
        message,
        count: plagiarismResults.length,
        data: plagiarismResults
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération des résultats de plagiat :", error);
      res.status(500).json({
        message: "Échec de la récupération des résultats de plagiat. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 