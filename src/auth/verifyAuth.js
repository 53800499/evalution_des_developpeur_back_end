const { User } = require('../db/sequelize');
const jwt = require('jsonwebtoken');
const privateKey = require('./private_key');

module.exports = (app) => {
  app.get('/api/auth/verify', async (req, res) => {
    try {
      // Récupération du token depuis les headers
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: {
            code: "NO_TOKEN",
            message: "Aucun token trouvé",
            userMessage: "Veuillez vous reconnecter"
          }
        });
      }

      // Vérification du token
      const decodedToken = jwt.verify(token, privateKey);
      const userId = decodedToken.userId;

      // Récupération des informations de l'utilisateur
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "Utilisateur non trouvé",
            userMessage: "Veuillez vous reconnecter"
          }
        });
      }

      // Génération d'un nouveau token
      const newToken = jwt.sign(
        { userId: user.id },
        privateKey,
        { expiresIn: '24h' }
      );

      // Préparation des données utilisateur
      const userData = {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || undefined,
        table: user.table
      };
      console.log(res.status('200'))
      return res.json({
        success: true,
        data: {
          user: userData,
          token: newToken
        }
      });

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          error: {
            code: "INVALID_TOKEN",
            message: "Token invalide",
            userMessage: "Veuillez vous reconnecter"
          }
        });
      }

      console.error("Erreur de vérification d'authentification :", error);
      return res.status(500).json({
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Une erreur est survenue",
          userMessage: "Une erreur est survenue. Veuillez réessayer plus tard."
        }
      });
    }
  });
}; 