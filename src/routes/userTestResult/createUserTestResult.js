const { UserTestResult, UserTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.post("/api/usertestresults", async (req, res) => {
    try {
      const { user_test_id, error_type, line_number, suggestion, execution_time } = req.body;

      // Vérification des champs obligatoires
      if (!user_test_id) {
        return res.status(400).json({ message: "L'identifiant du test utilisateur est obligatoire." });
      }

      // Vérifier que le test utilisateur existe
      const userTest = await UserTest.findByPk(user_test_id);
      if (!userTest) {
        return res.status(404).json({ message: `Le test utilisateur avec l'ID ${user_test_id} n'existe pas.` });
      }

      // Création du résultat
      const userTestResult = await UserTestResult.create({
        user_test_id,
        error_type,
        line_number,
        suggestion,
        execution_time
      });

      res.status(201).json({
        message: `Le résultat du test a bien été créé.`,
        data: userTestResult
      });

    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: "Ce résultat de test existe déjà.", data: error });
      }

      console.error("Erreur lors de la création du résultat de test :", error);
      res.status(500).json({
        message: "Échec de la création du résultat de test. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 