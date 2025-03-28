const { User } = require('../../db/sequelize')
const { Op } = require("sequelize")
const auth = require("../../auth/auth")

const capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1)

module.exports = (app) => {
  app.get('/api/users', auth, (req, res) => {
    if (req.query.name && req.query.name.trim() !== '') {
      const name = req.query.name.trim()
      const limit = parseInt(req.query.limit) || 5

      if (name.length < 2) {
        const message = `Le terme de recherche doit contenir au minimum 2 caractères.`
        return res.status(400).json({ message })        
      }

      const whereClause = {
        name: { [Op.like]: `%${name}%` }
      }
      
      if (req.query.role) {
        whereClause.role = req.query.role;
      }

      return User.findAndCountAll({ 
        where: whereClause,
        order: [['id', 'ASC']],
        limit: limit,
        attributes: { exclude: ['password'] }
      })
      .then(({ count, rows }) => {
        const message = count > 0 
          ? `Il y a ${count} utilisateur(s) correspondant au terme de recherche "${name}".`
          : `Aucun utilisateur ne correspond au terme de recherche "${name}".`
        return res.json({ message, data: rows })
      })
      .catch(error => {
        console.error("Erreur lors de la recherche :", error)
        const message = `Une erreur s'est produite lors de la récupération des utilisateurs. Veuillez réessayer plus tard.`
        res.status(500).json({ message, error: error.message })
      })
    } 
    else {
      const whereClause = {};
      
      if (req.query.role) {
        whereClause.role = req.query.role;
      }
      
      User.findAll({ 
        where: whereClause,
        order: [['id', 'ASC']],
        attributes: { exclude: ['password'] }
      })
      .then(users => {
        const roleFilter = req.query.role ? ` avec le rôle '${req.query.role}'` : '';
        const message = `La liste des utilisateurs${roleFilter} a bien été récupérée.`
        res.json({ message, data: users })
      })
      .catch(error => {
        console.error("Erreur lors de la récupération :", error)
        const message = `Une erreur s'est produite lors de la récupération des utilisateurs. Veuillez réessayer plus tard.`
        res.status(500).json({ message, error: error.message })
      })
    }
  })
}