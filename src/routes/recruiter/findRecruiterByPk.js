const { Recruiter } = require('../../db/sequelize')
const auth = require("../../auth/auth")

module.exports = (app) => {
  app.get('/api/recruiters/:id',auth, (req, res) => {
    Recruiter.findByPk(req.params.id)
      .then(recruiter => {
        if (!recruiter) {
          return res.status(404).json({ message: `Aucun recruiter trouvé avec l'ID ${req.params.id}.` });
        }

        const message = 'Un recruiter a bien été trouvé.';
        res.json({ message, data: recruiter });
      })
      .catch(error => {
        res.status(500).json({ message: "Une erreur est survenue.", error });
      });
  });
}