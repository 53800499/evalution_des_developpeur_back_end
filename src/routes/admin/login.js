const { Admin } = require('../../db/sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../../auth/private_key');

module.exports = (app) => {
  app.post('/api/admins/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Vérification des entrées
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe sont requis." });
      }

      // Recherche de l'administrateur
      const admin = await Admin.findOne({ where: { email } });

      // Vérification de l'existence de l'administrateur et du mot de passe
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ message: "Identifiants incorrects." });
      }

      // Mise à jour du dernier login
      await admin.update({ last_login: new Date() });

      // Génération du token JWT
      const token = jwt.sign(
        { 
          userId: admin.id
        },
        privateKey,
        { expiresIn: '24h' }
      );

      // On ne renvoie pas le mot de passe dans la réponse
      const adminWithoutPassword = {
        id: admin.id,
        unique_id: admin.unique_id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        is_verified: admin.is_verified,
        last_login: admin.last_login
      };

      return res.json({ 
        message: "Connexion réussie.", 
        data: adminWithoutPassword, 
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