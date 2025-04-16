const { UserTest, User, CodeTest } = require("../../db/sequelize");

module.exports = (app) => {
  app.get("/api/usertests/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      const userTest = await UserTest.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"]
          },
          {
            model: CodeTest,
            attributes: ["id", "name", "difficulty"]
          }
        ]
      });
      
      if (!userTest) {
        return res.status(404).json({ message: `Les informations de test avec l'ID ${id} n'existe pas.` });
      }
      
      res.json({
        message: `Les informations de test avec l'ID ${id} ont été trouvé.`,
        data: userTest
      });
      
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de test:", error);
      res.status(500).json({
        message: "Échec de la récupération des informations de test. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 