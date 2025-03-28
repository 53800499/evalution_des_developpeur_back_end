const { CodeTest } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.get('/api/tests/:id', auth, (req, res) => {
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

        const message = 'Un test a bien été trouvé.';
        res.json({ message, data: test });
      })
      .catch(error => {
        console.error("Erreur lors de la recherche d'un test :", error);
        res.status(500).json({ 
          message: "Une erreur est survenue lors de la recherche du test.", 
          error: error.message 
        });
      });
  });
}; 