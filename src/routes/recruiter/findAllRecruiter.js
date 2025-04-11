const { Recruiter } = require('../../db/sequelize')
const { Op } = require("sequelize")
const auth = require("../../auth/auth")

const capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1)

module.exports = (app) => {
  app.get('/api/recruiters', auth, (req, res) => {
    if (req.query.name) {
      const name = req.query.name.trim()
      const limit = parseInt(req.query.limit) || 5

      if (name.length < 2) {
        const message = `Le terme de recherche doit contenir au minimum 2 caractères.`
        return res.status(400).json({ message })        
      }

      return Recruiter.findAndCountAll({ 
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
        const message = `Il y a ${count} recruiters correspondant au terme de recherche "${name}".`
        return res.json({ message, data: rows })
      })
      .catch(error => {
        const message = `Une erreur s'est produite lors de la récupération des recruiters. Veuillez réessayer plus tard.`
        res.status(500).json({ message, error })
      })
    } 
    else {
      Recruiter.findAll({ order: [['name', 'ASC']] })
      .then(recruiters => {
        const message = 'La liste des utilisateurs a bien été récupérée.'
        res.json({ message, data: recruiters })
      })
      .catch(error => {
        const message = `Une erreur s'est produite lors de la récupération des recruiters. Veuillez réessayer plus tard.`
        res.status(500).json({ message, error })
      })
    }
  })
}