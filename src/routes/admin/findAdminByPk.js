const { Admin } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.get('/api/admins/:id', auth, (req, res) => {
    // Validation de l'ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }
    
    Admin.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
      .then(admin => {
        if (!admin) {
          return res.status(404).json({ message: `Aucun administrateur trouvé avec l'ID ${id}.` });
        }

        const message = 'Un administrateur a bien été trouvé.';
        res.json({ message, data: admin });
      })
      .catch(error => {
        console.error("Erreur lors de la recherche d'un administrateur :", error);
        res.status(500).json({ 
          message: "Une erreur est survenue lors de la recherche de l'administrateur.", 
          error: error.message 
        });
      });
  });
}; 