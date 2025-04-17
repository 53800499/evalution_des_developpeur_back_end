const { UserTestResult, UserTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.put("/api/usertestresults/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      // Vérifier si le résultat existe
      const userTestResult = await UserTestResult.findByPk(id);
      if (!userTestResult) {
        return res.status(404).json({ message: `Le résultat de test avec l'ID ${id} n'existe pas.` });
      }
      
      // Si user_test_id est fourni, vérifier qu'il existe
      if (req.body.user_test_id) {
        const userTest = await UserTest.findByPk(req.body.user_test_id);
        if (!userTest) {
          return res.status(404).json({ message: `Le test utilisateur avec l'ID ${req.body.user_test_id} n'existe pas.` });
        }
      }
      
      // Mise à jour du résultat
      await userTestResult.update(req.body);
      
      // Récupérer la version mise à jour
      const updatedUserTestResult = await UserTestResult.findByPk(id, {
        include: {
          model: UserTest,
          attributes: ["id", "user_id", "test_id", "status", "score"]
        }
      });
      
      res.json({
        message: `Le résultat de test a bien été mis à jour.`,
        data: updatedUserTestResult
      });
      
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: "Ce résultat de test existe déjà.", data: error });
      }
      
      console.error("Erreur lors de la mise à jour du résultat de test :", error);
      res.status(500).json({
        message: "Échec de la mise à jour du résultat de test. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 