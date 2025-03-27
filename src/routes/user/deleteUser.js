const { User } = require('../../db/sequelize')
const auth = require("../../auth/auth")

module.exports = (app) => {
  app.delete('/api/users/:id', auth, (req, res) => {
    // Validation de l'ID
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." })
    }
    
    User.findByPk(id)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: `Aucun utilisateur trouvé avec l'ID ${id}.` })
        }

        const userDeleted = user
        return User.destroy({
          where: { id: user.id }
        })
        .then(_ => {
          // On ne renvoie pas le mot de passe dans la réponse
          const userWithoutPassword = {
            id: userDeleted.id,
            unique_id: userDeleted.unique_id,
            firstName: userDeleted.firstName,
            lastName: userDeleted.lastName,
            email: userDeleted.email
          }
          
          const message = `L'utilisateur avec l'identifiant n°${userDeleted.id} a bien été supprimé.`
          res.json({message, data: userWithoutPassword })
        })
        .catch(error => {
          console.error("Erreur lors de la suppression d'un utilisateur :", error)
          const message = `L'utilisateur n'a pas pu être supprimé. Veuillez réessayer plus tard.`
          res.status(500).json({message, error: error.message})
        })
      })
  })
}