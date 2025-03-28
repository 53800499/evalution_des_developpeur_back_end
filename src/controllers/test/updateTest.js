const { CodeTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const updateTest = async (req, res) => {
  try {
    const testId = parseInt(req.params.id);
    if (isNaN(testId)) {
      return res.status(400).json({ message: "L'ID fourni n'est pas valide." });
    }

    const { name, description, difficulty, language, category, duration, passing_score, skills } = req.body;

    // Vérifier si le test existe
    const test = await CodeTest.findByPk(testId);
    if (!test) {
      return res.status(404).json({ message: `Aucun test trouvé avec l'ID ${testId}.` });
    }

    // Validation des champs modifiables
    const updates = {};
    
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;

    if (difficulty !== undefined) {
      const validDifficulties = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({
          message: "La difficulté doit être 'Débutant', 'Intermédiaire', 'Avancé' ou 'Expert'"
        });
      }
      updates.difficulty = difficulty;
    }

    if (language !== undefined) updates.language = language;
    
    if (category !== undefined) {
      const validCategories = ['Frontend', 'Backend', 'Full Stack', 'Algorithmes', 'DevOps'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: "La catégorie doit être 'Frontend', 'Backend', 'Full Stack', 'Algorithmes' ou 'DevOps'"
        });
      }
      updates.category = category;
    }

    if (duration !== undefined) {
      const validDurations = [30, 45, 60, 90, 120];
      if (!validDurations.includes(duration)) {
        return res.status(400).json({
          message: 'La durée doit être 30, 45, 60, 90 ou 120 minutes'
        });
      }
      updates.duration = duration;
    }

    if (passing_score !== undefined) {
      const validScores = [50, 60, 70, 75, 80, 90];
      if (!validScores.includes(passing_score)) {
        return res.status(400).json({
          message: 'Le score de réussite doit être 50, 60, 70, 75, 80 ou 90'
        });
      }
      updates.passing_score = passing_score;
    }

    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        return res.status(400).json({
          message: 'Les compétences doivent être un tableau'
        });
      }
      if (skills.length === 0) {
        return res.status(400).json({
          message: 'Au moins une compétence est requise'
        });
      }
      if (!skills.every(skill => typeof skill === 'string')) {
        return res.status(400).json({
          message: 'Toutes les compétences doivent être des chaînes de caractères'
        });
      }
      updates.skills = skills;
    } else {
      // Si skills n'est pas fourni dans la mise à jour, on garde les skills existants
      updates.skills = test.skills;
    }

    // Si aucun champ à mettre à jour
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Aucun champ valide à mettre à jour n'a été fourni."
      });
    }

    // Mettre à jour le test
    await test.update(updates);
    
    // Récupérer le test mis à jour
    const updatedTest = await CodeTest.findByPk(testId);

    res.json({
      message: `Le test "${updatedTest.name}" a été mis à jour avec succès.`,
      data: updatedTest
    });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du test :", error);

    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Erreur de validation des données",
        errors: error.errors.map(e => e.message)
      });
    }

    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Un test avec ce nom existe déjà."
      });
    }

    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour du test. Veuillez réessayer plus tard.",
      error: error.message
    });
  }
};

module.exports = updateTest; 