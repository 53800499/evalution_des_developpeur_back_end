const { UserTestResult } = require("../../db/sequelize");

module.exports = (app) => {
  app.delete("/api/usertestresults/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      // Vérifier si le résultat existe
      const userTestResult = await UserTestResult.findByPk(id);
      if (!userTestResult) {
        return res.status(404).json({ message: `Le résultat de test avec l'ID ${id} n'existe pas.` });
      }
      
      // Suppression du résultat
      await userTestResult.destroy();
      
      res.json({
        message: `Le résultat de test a bien été supprimé.`
      });
      
    } catch (error) {
      console.error("Erreur lors de la suppression du résultat de test :", error);
      res.status(500).json({
        message: "Échec de la suppression du résultat de test. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 