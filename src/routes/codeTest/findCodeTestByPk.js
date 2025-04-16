const { CodeTest, ProgrammingLanguage } = require("../../db/sequelize");

module.exports = (app) => {
  app.get("/api/codetests/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      const codeTest = await CodeTest.findByPk(id, {
        include: {
          model: ProgrammingLanguage,
          attributes: ["id", "name"]
        }
      });
      
      if (!codeTest) {
        return res.status(404).json({ message: `Le test avec l'ID ${id} n'existe pas.` });
      }
      
      res.json({
        message: "Le test a été trouvé.",
        data: codeTest
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération du test :", error);
      res.status(500).json({
        message: "Échec de la récupération du test. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 