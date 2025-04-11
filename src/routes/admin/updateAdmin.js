const { Admin } = require('../../db/sequelize')
const { ValidationError, UniqueConstraintError } = require("sequelize") 
const auth = require("../../auth/auth")
const admin = require('../../models/admin')

module.exports = (app) => {
  app.put('/api/admins/:id', auth, (req, res) => {
    const id = req.params.id
    Admin.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      return Admin.findByPk(id).then(admin => {
        if (admin === null) {
          const message = `L' admin demandé n'a pu être récupéré`
          res.status(404).json({message})
        }
        const message = `L' admin ${admin.name} a bien été modifié.`
        res.json({message, data: admin })
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

      const message = `L' admin n' a pas pû mis à jour. Veuillez réessayer plus tard.`
      res.status(500).json({message})
    })
  })
}