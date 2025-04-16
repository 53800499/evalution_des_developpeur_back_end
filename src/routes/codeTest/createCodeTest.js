const { CodeTest, ProgrammingLanguage } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.post("/api/codetests", async (req, res) => {
    try {
      const { name, description, difficulty, language_id } = req.body;

      // Vérification des champs obligatoires
      if (!name || !description || !difficulty || !language_id) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
      }

      // Vérifier que le langage existe
      const language = await ProgrammingLanguage.findByPk(language_id);
      if (!language) {
        return res.status(404).json({ message: `Le langage avec l'ID ${language_id} n'existe pas.` });
      }

      // Création du test de code
      const codeTest = await CodeTest.create({
        name,
        description,
        difficulty,
        language_id
      });

      res.status(201).json({
        message: `Le test  "${codeTest.name}" a bien été créé.`,
        data: codeTest
      });

    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: "Ce nom de test est déjà utilisé.", data: error });
      }

      console.error("Erreur lors de la création du test de code :", error);
      res.status(500).json({
        message: "Échec de la création du test de code. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 