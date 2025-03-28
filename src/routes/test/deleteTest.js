const { CodeTest } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.delete('/api/tests/:id', auth, (req, res) => {
    // Validation de l'ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }
    
    CodeTest.findByPk(id)
      .then(test => {
        if (!test) {
          return res.status(404).json({ message: `Aucun test trouvé avec l'ID ${id}.` });
        }

        const testDeleted = test;
        return CodeTest.destroy({
          where: { id: test.id }
        })
        .then(_ => {
          const message = `Le test "${testDeleted.name}" a bien été supprimé.`;
          res.json({message, data: testDeleted });
        });
      })
      .catch(error => {
        console.error("Erreur lors de la suppression d'un test :", error);
        const message = `Le test n'a pas pu être supprimé. Veuillez réessayer plus tard.`;
        res.status(500).json({message, error: error.message});
      });
  });
}; 