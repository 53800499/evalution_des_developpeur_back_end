const { PlagiarismResult, UserTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.post("/api/plagiarismresults", async (req, res) => {
    try {
      const { user_test_id, plagiarism_score, plagiarism_source } = req.body;

      // Vérification des champs obligatoires
      if (!user_test_id || !plagiarism_score) {
        return res.status(400).json({ message: "Les champs user_test_id et plagiarism_score sont obligatoires." });
      }

      // Vérifier que le test utilisateur existe
      const userTest = await UserTest.findByPk(user_test_id);
      if (!userTest) {
        return res.status(404).json({ message: `Le test utilisateur avec l'ID ${user_test_id} n'existe pas.` });
      }

      // Création du résultat de plagiat
      const plagiarismResult = await PlagiarismResult.create({
        user_test_id,
        plagiarism_score,
        plagiarism_source
      });

      res.status(201).json({
        message: `Le résultat de plagiat a bien été créé.`,
        data: plagiarismResult
      });

    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: "Ce résultat de plagiat existe déjà.", data: error });
      }

      console.error("Erreur lors de la création du résultat de plagiat :", error);
      res.status(500).json({
        message: "Échec de la création du résultat de plagiat. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 