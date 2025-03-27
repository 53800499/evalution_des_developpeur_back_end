const { User } = require('../../db/sequelize')
const auth = require("../../auth/auth")

module.exports = (app) => {
  app.get('/api/users/:id', auth, (req, res) => {
    // Validation de l'ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }
    
    User.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: `Aucun utilisateur trouvé avec l'ID ${id}.` });
        }

        const message = 'Un utilisateur a bien été trouvé.';
        res.json({ message, data: user });
      })
      .catch(error => {
        console.error("Erreur lors de la recherche d'un utilisateur :", error);
        res.status(500).json({ 
          message: "Une erreur est survenue lors de la recherche de l'utilisateur.", 
          error: error.message 
        });
      });
  });
}