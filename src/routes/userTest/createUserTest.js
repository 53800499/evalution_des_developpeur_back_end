const { UserTest, User, CodeTest } = require("../../db/sequelize");
const { ValidationError } = require("sequelize");

module.exports = (app) => {
  app.post("/api/usertests", async (req, res) => {
    try {
      const { user_id, test_id, status } = req.body;

      // Vérification des champs obligatoires
      if (!user_id || !test_id || !status) {
        return res.status(400).json({ message: "Les champs user_id, test_id et status sont obligatoires." });
      }

      // Vérifier que l'utilisateur existe
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({ message: `L'utilisateur avec l'ID ${user_id} n'existe pas.` });
      }

      // Vérifier que le test existe
      const test = await CodeTest.findByPk(test_id);
      if (!test) {
        return res.status(404).json({ message: `Le test avec l'ID ${test_id} n'existe pas.` });
      }

      // Création des informations de l'utilisateur concernant le test
      const userTest = await UserTest.create({
        user_id,
        test_id,
        start_time: new Date(),
        status,
        score: null,
        end_time: null,
        result_details: null
      });

      res.status(201).json({
        message: `Les information de l'utilisateur concernant le test d'id ${test_id} ont bien été enregistrer.`,// information de l'utilisateur cocernant un test specifique
        data: userTest
      });

    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      console.error(`Erreur lors de l'enregistrement des information de l'utilisateur pour le test d'id ${test_id}:`, error);
      res.status(500).json({
        message: `Échec de l'enregistrement des information de l'utisateur concernant le test d'id ${test_id}. Veuillez réessayer plus tard.`,
        error: error.message
      });
    }
  });
}; 