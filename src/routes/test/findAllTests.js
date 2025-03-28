const { CodeTest } = require('../../db/sequelize');
const { Op } = require("sequelize");
const auth = require("../../auth/auth");

module.exports = (app) => {
  app.get('/api/tests', auth, (req, res) => {
    if (req.query.name && req.query.name.trim() !== '') {
      const name = req.query.name.trim();
      const limit = parseInt(req.query.limit) || 5;

      if (name.length < 2) {
        const message = `Le terme de recherche doit contenir au minimum 2 caractères.`;
        return res.status(400).json({ message });        
      }

      const whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${name}%` } },
          { language: { [Op.like]: `%${name}%` } }
        ]
      };

      // Ajouter les filtres supplémentaires si présents
      if (req.query.difficulty) {
        whereClause.difficulty = req.query.difficulty;
      }
      if (req.query.category) {
        whereClause.category = req.query.category;
      }
      if (req.query.language) {
        whereClause.language = req.query.language;
      }
      if (req.query.skills) {
        whereClause.skills = { [Op.contains]: [req.query.skills] };
      }

      return CodeTest.findAndCountAll({ 
        where: whereClause,
        order: [['id', 'ASC']],
        limit: limit
      })
      .then(({ count, rows }) => {
        const message = count > 0 
          ? `Il y a ${count} test(s) correspondant au terme de recherche "${name}".`
          : `Aucun test ne correspond au terme de recherche "${name}".`;
        return res.json({ message, data: rows });
      })
      .catch(error => {
        console.error("Erreur lors de la recherche :", error);
        const message = `Une erreur s'est produite lors de la récupération des tests. Veuillez réessayer plus tard.`;
        res.status(500).json({ message, error: error.message });
      });
    }
    else {
      const whereClause = {};
      
      // Ajouter tous les filtres possibles
      if (req.query.difficulty) {
        const validDifficulties = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
        if (!validDifficulties.includes(req.query.difficulty)) {
          return res.status(400).json({
            message: "La difficulté doit être 'Débutant', 'Intermédiaire', 'Avancé' ou 'Expert'"
          });
        }
        whereClause.difficulty = req.query.difficulty;
      }
      
      if (req.query.category) {
        const validCategories = ['Frontend', 'Backend', 'Full Stack', 'Algorithmes', 'DevOps'];
        if (!validCategories.includes(req.query.category)) {
          return res.status(400).json({
            message: "La catégorie doit être 'Frontend', 'Backend', 'Full Stack', 'Algorithmes' ou 'DevOps'"
          });
        }
        whereClause.category = req.query.category;
      }
      
      if (req.query.language) {
        whereClause.language = req.query.language;
      }

      if (req.query.skills) {
        whereClause.skills = { [Op.contains]: [req.query.skills] };
      }
      
      CodeTest.findAll({ 
        where: whereClause,
        order: [['id', 'ASC']]
      })
      .then(tests => {
        // Construire le message avec les filtres appliqués
        const filters = [];
        if (req.query.difficulty) filters.push(`difficulté '${req.query.difficulty}'`);
        if (req.query.category) filters.push(`catégorie '${req.query.category}'`);
        if (req.query.language) filters.push(`langage '${req.query.language}'`);
        if (req.query.skills) filters.push(`compétence '${req.query.skills}'`);
        
        const filterMessage = filters.length > 0 ? ` (filtré par ${filters.join(' et ')})` : '';
        const message = `La liste des tests${filterMessage} a bien été récupérée.`;
        res.json({ message, data: tests });
      })
      .catch(error => {
        console.error("Erreur lors de la récupération :", error);
        const message = `Une erreur s'est produite lors de la récupération des tests. Veuillez réessayer plus tard.`;
        res.status(500).json({ message, error: error.message });
      });
    }
  });
}; 