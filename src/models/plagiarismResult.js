module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PlagiarismResult', {
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
    plagiarism_score: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le score de plagiat est requis.' },
        min: {
          args: [0],
          msg: 'Le score de plagiat ne peut pas être inférieur à 0.'
        },
        max: {
          args: [100],
          msg: 'Le score de plagiat ne peut pas être supérieur à 100.'
        }
      }
    },
    plagiarism_source: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
}; 