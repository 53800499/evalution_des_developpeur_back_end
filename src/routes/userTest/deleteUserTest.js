const { UserTest } = require("../../db/sequelize");

module.exports = (app) => {
  app.delete("/api/usertests/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      // Vérifier si les informations de l'utilisateur concernant le test existe
      const userTest = await UserTest.findByPk(id);
      if (!userTest) {
        return res.status(404).json({ message: `Aucunne information de test  avec l'ID ${id}.` });
      }
      
      // Suppression du test utilisateur
      await userTest.destroy();
      
      res.json({
        message: `Les informations de l'utilisateur concernant le test d'id ${id} ont bien été supprimé.`
      });
      
    } catch (error) {
      console.error("Erreur lors de la suppression des informations de l'utilisateur concernant le test d'id ${id}:", error);
      res.status(500).json({
        message: "Échec de la suppression des informations de l'utilisateur concernant le test d'id ${id}. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 