const { Admin } = require('../../db/sequelize');
const { Op } = require("sequelize");
const auth = require("../../auth/auth");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.substring(1);

module.exports = (app) => {
  app.get('/api/admins', auth, (req, res) => {
    if (req.query.name && req.query.name.trim() !== '') {
      const name = req.query.name.trim();
      const limit = parseInt(req.query.limit) || 5;

      if (name.length < 2) {
        const message = `Le terme de recherche doit contenir au minimum 2 caractères.`;
        return res.status(400).json({ message });        
      }

      return Admin.findAndCountAll({ 
        where: { 
          [Op.or]: [
            { firstName: { [Op.like]: `%${name}%` } },
            { lastName: { [Op.like]: `%${name}%` } },
            { firstName: { [Op.startsWith]: capitalize(name) } },
            { lastName: { [Op.startsWith]: capitalize(name) } }
          ]
        },
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
        limit: limit,
        attributes: { exclude: ['password'] }
      })
      .then(({ count, rows }) => {
        const message = count > 0 
          ? `Il y a ${count} administrateur(s) correspondant au terme de recherche "${name}".`
          : `Aucun administrateur ne correspond au terme de recherche "${name}".`;
        return res.json({ message, data: rows });
      })
      .catch(error => {
        console.error("Erreur lors de la recherche :", error);
        const message = `Une erreur s'est produite lors de la récupération des administrateurs. Veuillez réessayer plus tard.`;
        res.status(500).json({ message, error: error.message });
      });
    } 
    else {
      Admin.findAll({ 
        order: [['firstName', 'ASC'], ['lastName', 'ASC']],
        attributes: { exclude: ['password'] }
      })
      .then(admins => {
        const message = 'La liste des administrateurs a bien été récupérée.';
        res.json({ message, data: admins });
      })
      .catch(error => {
        console.error("Erreur lors de la récupération :", error);
        const message = `Une erreur s'est produite lors de la récupération des administrateurs. Veuillez réessayer plus tard.`;
        res.status(500).json({ message, error: error.message });
      });
    }
  });
}; 