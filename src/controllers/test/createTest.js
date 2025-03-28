const { CodeTest } = require("../../db/sequelize");
const { ValidationError, UniqueConstraintError } = require("sequelize");

const createTest = async (req, res) => {
  try {
    const { name, description, difficulty, language, category, duration, passing_score, skills } = req.body;

    // Validation des champs requis
    if (!name || !difficulty || !language || !category || !duration || !passing_score || !skills) {
      return res.status(400).json({
        message: 'Tous les champs sont requis : name, difficulty, language, category, duration, passing_score, skills'
      });
    }

    // Validation de la durée
    const validDurations = [30, 45, 60, 90, 120];
    if (!validDurations.includes(duration)) {
      return res.status(400).json({
        message: 'La durée doit être 30, 45, 60, 90 ou 120 minutes'
      });
    }

    // Validation du score de réussite
    const validScores = [50, 60, 70, 75, 80, 90];
    if (!validScores.includes(passing_score)) {
      return res.status(400).json({
        message: 'Le score de réussite doit être 50, 60, 70, 75, 80 ou 90'
      });
    }

    // Validation de la catégorie
    const validCategories = ['Frontend', 'Backend', 'Full Stack', 'Algorithmes', 'DevOps'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: "La catégorie doit être 'Frontend', 'Backend', 'Full Stack', 'Algorithmes' ou 'DevOps'"
      });
    }

    // Validation de la difficulté
    const validDifficulties = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        message: "La difficulté doit être 'Débutant', 'Intermédiaire', 'Avancé' ou 'Expert'"
      });
    }

    // Validation des compétences
    if (!Array.isArray(skills) || skills.length === 0 || !skills.every(skill => typeof skill === 'string')) {
      return res.status(400).json({
        message: 'Les compétences doivent être un tableau non vide de chaînes de caractères'
      });
    }

    // Création du test
    const test = await CodeTest.create({
      name,
      description,
      difficulty,
      language,
      category,
      duration,
      passing_score,
      skills
    });

    const message = `Le test "${test.name}" a été créé avec succès`;
    res.status(201).json({
      message,
      data: test
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        message: "Erreur de validation des données",
        errors: error.errors.map((e) => e.message),
      });
    }

    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        message: "Un test avec ce nom existe déjà.",
      });
    }

    console.error("Erreur lors de la création du test :", error);
    const message = `Le test n'a pas pu être créé. Réessayez dans quelques instants.`;
    res.status(500).json({ message, data: error.message });
  }
};

module.exports = createTest; 