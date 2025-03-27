const { Recruiter } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.get('/api/recruiters/:id', auth, (req, res) => {
    // Validation de l'ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }
    
    Recruiter.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
      .then(recruiter => {
        if (!recruiter) {
          return res.status(404).json({ message: `Aucun recruteur trouvé avec l'ID ${id}.` });
        }

        const message = 'Un recruteur a bien été trouvé.';
        res.json({ message, data: recruiter });
      })
      .catch(error => {
        console.error("Erreur lors de la recherche d'un recruteur :", error);
        res.status(500).json({ 
          message: "Une erreur est survenue lors de la recherche du recruteur.", 
          error: error.message 
        });
      });
  });
}; 