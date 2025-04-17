const { PlagiarismResult } = require("../../db/sequelize");

module.exports = (app) => {
  app.delete("/api/plagiarismresults/:id", async (req, res) => {
    try {
      const id = req.params.id;
      
      // Vérifier si le résultat existe
      const plagiarismResult = await PlagiarismResult.findByPk(id);
      if (!plagiarismResult) {
        return res.status(404).json({ message: `Le résultat de plagiat avec l'ID ${id} n'existe pas.` });
      }
      
      // Suppression du résultat
      await plagiarismResult.destroy();
      
      res.json({
        message: `Le résultat de plagiat a bien été supprimé.`
      });
      
    } catch (error) {
      console.error("Erreur lors de la suppression du résultat de plagiat :", error);
      res.status(500).json({
        message: "Échec de la suppression du résultat de plagiat. Veuillez réessayer plus tard.",
        error: error.message
      });
    }
  });
}; 