const { Recruiter } = require('../../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../../auth/private_key');

module.exports = (app) => {
  app.post('/api/recruiters/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérification des entrées
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe sont requis." });
      }

      // Recherche du recruteur
      const recruiter = await Recruiter.findOne({ where: { email } });

      // Vérification de l'existence du recruteur et du mot de passe
      if (!recruiter || !(await bcrypt.compare(password, recruiter.password))) {
        return res.status(401).json({ message: "Identifiants incorrects." });
      }

      // Mise à jour du dernier login
      await recruiter.update({ last_login: new Date() });

      // Génération du token JWT
      const token = jwt.sign(
        { 
          userId: recruiter.id,
          role: 'recruiter'
        },
        privateKey,
        { expiresIn: '24h' }
      );

      // On ne renvoie pas le mot de passe dans la réponse
      const recruiterWithoutPassword = {
        id: recruiter.id,
        unique_id: recruiter.unique_id,
        firstName: recruiter.firstName,
        lastName: recruiter.lastName,
        email: recruiter.email,
        company: recruiter.company,
        position: recruiter.position,
        phone: recruiter.phone,
        website: recruiter.website,
        is_verified: recruiter.is_verified,
        last_login: recruiter.last_login
      };

      return res.json({ 
        message: "Connexion réussie.", 
        data: recruiterWithoutPassword, 
        token 
      });

    } catch (error) {
      console.error("Erreur de connexion :", error);
      return res.status(500).json({
        message: "Une erreur est survenue. Veuillez réessayer plus tard.",
        data: error.message
      });
    }
  });
}; 