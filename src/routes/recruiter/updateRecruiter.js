const { Recruiter } = require('../../db/sequelize')
const { ValidationError, UniqueConstraintError } = require("sequelize") 
const auth = require("../../auth/auth")

module.exports = (app) => {
  app.put('/api/recruiters/:id', auth, (req, res) => {
    const id = req.params.id
   Recruiter.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      return Recruiter.findByPk(id).then(recruiter => {
        if (recruiter === null) {
          const message = `Le recruiter demandé n'a pu être récupéré`
          res.status(404).json({message})
        }
        const message = `Le recruiter ${recruiter.name} a bien été modifié.`
        res.json({message, data: recruiter })
      })
    })
    .catch(error => { 
        // Si c'est une erreur de validation (ex : champs manquants ou incorrects)
         if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message, data: error })
        }
        // Si c'est une erreure issue de la contrainte d' unicité
        if (error instanceof UniqueConstraintError) {
            return res.status(400).json({ message: ValidationErrorItemType.message, data: error })
        }

      const message = `Le recruiter n' a pas pû mis à jour. Veuillez réessayer plus tard.`
      res.status(500).json({message})
    })
  })
}