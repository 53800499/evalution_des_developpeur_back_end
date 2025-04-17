const { CodeTest } = require("../../db/sequelize");

module.exports = (app) => {
  app.delete("/api/codetests/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      // Vérifier si le test existe
      const codeTest = await CodeTest.findByPk(id);
      if (!codeTest) {
        return res.status(404).json({ message: `Le test  avec l'ID ${id} n'existe pas.` });
      }
      
      // Suppression du test
      const testName = codeTest.name;
      await codeTest.destroy();
      
      res.json({
        message: `Le test  ${testName} a bien été supprimé.`
      });
      
    } catch (error) {
      console.error("Erreur lors de la suppression du test  :", error);
      res.status(500).json({
        message: "Échec de la suppression du test . Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 