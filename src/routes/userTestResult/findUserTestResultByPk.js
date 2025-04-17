const { UserTestResult, UserTest } = require("../../db/sequelize");

module.exports = (app) => {
  app.get("/api/usertestresults/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      const userTestResult = await UserTestResult.findByPk(id, {
        include: {
          model: UserTest,
          attributes: ["id", "user_id", "test_id", "status", "score"]
        }
      });
      
      if (!userTestResult) {
        return res.status(404).json({ message: `Le résultat de test avec l'ID ${id} n'existe pas.` });
      }
      
      res.json({
        message: "Le résultat de test a été trouvé.",
        data: userTestResult
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération du résultat de test :", error);
      res.status(500).json({
        message: "Échec de la récupération du résultat de test. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 