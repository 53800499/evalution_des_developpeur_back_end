module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserTestResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'L\'identifiant du test utilisateur est requis.' }
      }
    },
    error_type: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [['syntax_error', 'runtime_error', 'logical_error', 'performance_issue', 'style_issue', 'none']],// we can add more later(nous pouvons ajouter plus après)
          msg: 'Le type d\'erreur doit être syntax_error, runtime_error, logical_error, performance_issue, style_issue ou none.'
        }
      }
    },
    line_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Le numéro de ligne ne peut pas être négatif.'
        }
      }
    },
    suggestion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    execution_time: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Le temps d\'exécution ne peut pas être négatif.'
        }
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
}; 