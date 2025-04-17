const { UserTest, User, CodeTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

module.exports = (app) => {
  app.put("/api/usertests/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      // Vérifier si les informations de l'utilisateur concernant le test existe
      const userTest = await UserTest.findByPk(id);
      if (!userTest) {
        return res.status(404).json({ message: `Les informations de test avec l'ID ${id} n'existe pas.` });
      }
      
      // Si un user_id est fourni, vérifier qu'il existe
      if (req.body.user_id) {
        const user = await User.findByPk(req.body.user_id);
        if (!user) {
          return res.status(404).json({ message: `L'utilisateur avec l'ID ${req.body.user_id} n'existe pas.` });
        }
      }
      
      // Si un test_id est fourni, vérifier qu'il existe
      if (req.body.test_id) {
        const test = await CodeTest.findByPk(req.body.test_id);
        if (!test) {
          return res.status(404).json({ message: `Le test avec l'ID ${req.body.test_id} n'existe pas.` });
        }
      }
      
      // Mise à jour du test
      await userTest.update(req.body);
      
      // Récupérer la version mise à jour avec les relations
      const updatedUserTest = await UserTest.findByPk(id, {
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
      
      res.json({
        message: `Les informations de test avec l'ID ${id} ont bien été mis à jour.`,
        data: updatedUserTest
      });
      
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ message: "Ces informations de test existent déjà.", data: error });
      }
      
      console.error("Erreur lors de la mise à jour des informations de test :", error);
      res.status(500).json({
        message: "Échec de la mise à jour des informations de test. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 