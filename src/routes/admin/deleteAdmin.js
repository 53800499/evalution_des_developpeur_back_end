const { Admin } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.delete('/api/admins/:id', auth, (req, res) => {
    // Validation de l'ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }
    
    Admin.findByPk(id)
      .then(admin => {
        if (!admin) {
          return res.status(404).json({ message: `Aucun administrateur trouvé avec l'ID ${id}.` });
        }

        const adminDeleted = admin;
        return Admin.destroy({
          where: { id: admin.id }
        })
        .then(_ => {
          // On ne renvoie pas le mot de passe dans la réponse
          const adminWithoutPassword = {
            id: adminDeleted.id,
            unique_id: adminDeleted.unique_id,
            firstName: adminDeleted.firstName,
            lastName: adminDeleted.lastName,
            email: adminDeleted.email
          };

          const message = `L'administrateur avec l'identifiant n°${adminDeleted.id} a bien été supprimé.`;
          res.json({message, data: adminWithoutPassword });
        });
      })
      .catch(error => {
        console.error("Erreur lors de la suppression d'un administrateur :", error);
        const message = `L'administrateur n'a pas pu être supprimé. Veuillez réessayer plus tard.`;
        res.status(500).json({message, error: error.message});
      });
  });
}; 