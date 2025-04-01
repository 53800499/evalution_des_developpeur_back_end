const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const CodeTest = sequelize.define('CodeTest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    unique_id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le nom du test est requis' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    difficulty: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Débutant', 'Intermédiaire', 'Avancé', 'Expert']],
          msg: "La difficulté doit être 'Débutant', 'Intermédiaire', 'Avancé' ou 'Expert'"
        }
      }
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: {
          args: [['Frontend', 'Backend', 'Full Stack', 'Algorithmes', 'DevOps']],
          msg: "La catégorie doit être 'Frontend', 'Backend', 'Full Stack', 'Algorithmes' ou 'DevOps'"
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: {
          args: [[30, 45, 60, 90, 120]],
          msg: "La durée doit être 30, 45, 60, 90 ou 120 minutes"
        }
      }
    },
    passing_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: {
          args: [[50, 60, 70, 75, 80, 90]],
          msg: "Le score de réussite doit être 50, 60, 70, 75, 80 ou 90"
        }
      }
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '[]',
      get() {
        const rawValue = this.getDataValue('skills');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('skills', Array.isArray(value) ? JSON.stringify(value) : '[]');
      },
      validate: {
        isValidSkillsArray(value) {
          if (!Array.isArray(value)) {
            throw new Error('Les compétences doivent être un tableau');
          }
          if (value.length === 0) {
            throw new Error('Au moins une compétence est requise');
          }
          if (!value.every(skill => typeof skill === 'string')) {
            throw new Error('Toutes les compétences doivent être des chaînes de caractères');
          }
        }
      }
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le langage de programmation est requis' }
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'code_tests'
  });

  return CodeTest;
}; 