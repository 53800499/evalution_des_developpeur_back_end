const { Recruiter } = require('../../db/sequelize')
const auth = require("../../auth/auth")
const recruiter = require('../../models/recruiter')

module.exports = (app) => {
  app.delete('/api/recruiters/:id',auth, (req, res) => {
    Recruiter.findByPk(req.params.id).then(recruiter => {
      if (recruiter === null) {
        const message = `Le recruiter demandé n'a pu être récupéré`
        res.status(404).json({message})
      }
      const recruiterDeleted = recruiter;
      return Recruiter.destroy({
        where: { id: recruiter.id }
      })
      .then(_ => {
        const message = `Le recruiter avec l'identifiant n°${recruiterDeleted.id} a bien été supprimé.`
        res.json({message, data: recruiterDeleted })
      })
      .catch(error => {
        const message = `Le recruiter n' a pas pû supprimé. Veuillez réessayer plus tard.`
        res.status(500).json({message})
      })
    })
  })
}