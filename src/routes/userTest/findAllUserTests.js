const { UserTest, User, CodeTest } = require("../../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/usertests", async (req, res) => {
    try {
      const { user_id, test_id, status } = req.query;
      const limit = parseInt(req.query.limit) || 100;
      
      // Construction du filtre de recherche
      let where = {};
      
      if (user_id) {
        where.user_id = user_id;
      }
      
      if (test_id) {
        where.test_id = test_id;
      }
      
      if (status) {
        where.status = status;
      }
      
      // Récupération des informations des tests concernant les utilisateurs
      const userTests = await UserTest.findAll({
        where,
        limit: limit,
        order: [["created_at", "DESC"]],
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"]
          },
          {
            model: CodeTest,
            attributes: ["id", "name", "difficulty"]
          }
        ]
      });
      
      const message = userTests.length > 0 
        ? "La liste des informations de tests concernant les utilisateurs a bien été récupérée." 
        : "Aucune information de test trouvé.";
      
      res.json({
        message,
        count: userTests.length,
        data: userTests
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération des informations des tests concernant les utilisateurs :", error);
      res.status(500).json({
        message: "Échec de la récupération des informations des tests concernant les utilisateurs. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 