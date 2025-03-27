const { Recruiter } = require('../../db/sequelize');
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.delete('/api/recruiters/:id', auth, (req, res) => {
    // Validation de l'ID
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }
    
    Recruiter.findByPk(id)
      .then(recruiter => {
        if (!recruiter) {
          return res.status(404).json({ message: `Aucun recruteur trouvé avec l'ID ${id}.` });
        }

        const recruiterDeleted = recruiter;
        return Recruiter.destroy({
          where: { id: recruiter.id }
        })
        .then(_ => {
          // On ne renvoie pas le mot de passe dans la réponse
          const recruiterWithoutPassword = {
            id: recruiterDeleted.id,
            unique_id: recruiterDeleted.unique_id,
            firstName: recruiterDeleted.firstName,
            lastName: recruiterDeleted.lastName,
            email: recruiterDeleted.email,
            company: recruiterDeleted.company,
            position: recruiterDeleted.position,
            phone: recruiterDeleted.phone,
            website: recruiterDeleted.website
          };

          const message = `Le recruteur avec l'identifiant n°${recruiterDeleted.id} a bien été supprimé.`;
          res.json({message, data: recruiterWithoutPassword });
        });
      })
      .catch(error => {
        console.error("Erreur lors de la suppression d'un recruteur :", error);
        const message = `Le recruteur n'a pas pu être supprimé. Veuillez réessayer plus tard.`;
        res.status(500).json({message, error: error.message});
      });
  });
}; 