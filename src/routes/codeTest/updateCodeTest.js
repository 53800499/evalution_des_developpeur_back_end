const { CodeTest, ProgrammingLanguage } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.put("/api/codetests/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      // Vérifier si le test existe
      const codeTest = await CodeTest.findByPk(id);
      if (!codeTest) {
        return res.status(404).json({ message: `Le test  avec l'ID ${id} n'existe pas.` });
      }
      
      // Si un language_id est fourni, vérifier qu'il existe
      if (req.body.language_id) {
        const language = await ProgrammingLanguage.findByPk(req.body.language_id);
        if (!language) {
          return res.status(404).json({ message: `Le langage avec l'ID ${req.body.language_id} n'existe pas.` });
        }
      }
      
      // Mise à jour du test
      await codeTest.update(req.body);
      
      // Récupérer la version mise à jour avec le langage
      const updatedCodeTest = await CodeTest.findByPk(id, {
        include: {
          model: ProgrammingLanguage,
          attributes: ["id", "name"]
        }
      });
      
      res.json({
        message: `Le test  ${updatedCodeTest.name} a bien été mis à jour.`,
        data: updatedCodeTest
      });
      
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: "Ce nom de test est déjà utilise.", data: error });
      }
      
      console.error("Erreur lors de la mise à jour du test  :", error);
      res.status(500).json({
        message: "Échec de la mise à jour du test . Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 