const { Admin } = require('../../db/sequelize')
const auth = require("../../auth/auth")

module.exports = (app) => {
  app.delete('/api/admins/:id',auth, (req, res) => {
    Admin.findByPk(req.params.id).then(admin => {
      if (admin === null) {
        const message = `L' admin demandé n'a pu être récupéré`
        res.status(404).json({message})
      }
      const adminDeleted = admin;
      return Admin.destroy({
        where: { id: admin.id }
      })
      .then(_ => {
        const message = `L' admin avec l'identifiant n°${adminDeleted.id} a bien été supprimé.`
        res.json({message, data: adminDeleted })
      })
      .catch(error => {
        const message = `L' admin n' a pas pû supprimé. Veuillez réessayer plus tard.`
        res.status(500).json({message})
      })
    })
  })
}