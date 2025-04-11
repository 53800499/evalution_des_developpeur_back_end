const { Admin } = require('../../db/sequelize')
const { Op } = require("sequelize")
const auth = require("../../auth/auth")

const capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1)

module.exports = (app) => {
  app.get('/api/admins', auth, (req, res) => {
    if (req.query.name) {
      const name = req.query.name.trim()
      const limit = parseInt(req.query.limit) || 5

      if (name.length < 2) {
        const message = `Le terme de recherche doit contenir au minimum 2 caractères.`
        return res.status(400).json({ message })        
      }

      return Admin.findAndCountAll({ 
        where: { 
          [Op.or]: [
            { name: { [Op.like]: `%${name}%` } },
            { name: { [Op.startsWith]: capitalize(name) } }
          ]
        },
        order: [['name', 'ASC']],
        limit: limit
      })
      .then(({ count, rows }) => {
        const message = `Il y a ${count} admins correspondant au terme de recherche "${name}".`
        return res.json({ message, data: rows })
      })
      .catch(error => {
        const message = `Une erreur s'est produite lors de la récupération des admins. Veuillez réessayer plus tard.`
        res.status(500).json({ message, error })
      })
    } 
    else {
      Admin.findAll({ order: [['name', 'ASC']] })
      .then(admins => {
        const message = 'La liste des utilisateurs a bien été récupérée.'
        res.json({ message, data: admins })
      })
      .catch(error => {
        const message = `Une erreur s'est produite lors de la récupération des admins. Veuillez réessayer plus tard.`
        res.status(500).json({ message, error })
      })
    }
  })
}