const { CodeTest, ProgrammingLanguage } = require("../../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/codetests", async (req, res) => {
    try {
      const { name, difficulty } = req.query;
      const limit = parseInt(req.query.limit) || 100;
      
      // Construction du filtre de recherche
      let where = {};
      
      if (name) {
        where.name = {
          [Op.like]: `%${name}%`
        };
      }
      
      if (difficulty) {
        where.difficulty = difficulty;
      }
      
      // Récupération des tests de code avec leurs langages associés
      const codeTests = await CodeTest.findAll({
        where,
        limit: limit,
        order: [["name", "ASC"]],
        include: {
          model: ProgrammingLanguage,
          attributes: ["id", "name"]
        }
      });
      
      const message = codeTests.length > 0 
        ? "La liste des tests  a bien été récupérée." 
        : "Aucun test trouvé.";
      
      res.json({
        message,
        count: codeTests.length,
        data: codeTests
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération des tests :", error);
      res.status(500).json({
        message: "Échec de la récupération des tests. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 