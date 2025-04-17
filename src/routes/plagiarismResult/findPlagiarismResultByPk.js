const { PlagiarismResult, UserTest } = require("../../db/sequelize");

module.exports = (app) => {
  app.get("/api/plagiarismresults/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      const plagiarismResult = await PlagiarismResult.findByPk(id, {
        include: {
          model: UserTest,
          attributes: ["id", "user_id", "test_id", "status", "score"]
        }
      });
      
      if (!plagiarismResult) {
        return res.status(404).json({ message: `Le résultat de plagiat avec l'ID ${id} n'existe pas.` });
      }
      
      res.json({
        message: "Le résultat de plagiat a été trouvé.",
        data: plagiarismResult
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération du résultat de plagiat :", error);
      res.status(500).json({
        message: "Échec de la récupération du résultat de plagiat. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 