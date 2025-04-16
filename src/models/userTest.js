module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserTest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'L\'identifiant de l\'utilisateur est requis.' }
      }
    },
    test_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'L\'identifiant du test est requis.' }
      }
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Le score ne peut pas être inférieur à 0.'
        },
        max: {
          args: [100],
          msg: 'Le score ne peut pas être supérieur à 100.'
        }
      }
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'L\'heure de début est requise.' }
      }
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le statut ne peut pas être vide.' },
        notNull: { msg: 'Le statut est requis.' },
        isIn: {
          args: [['completed', 'in_progress', 'failed']],
          msg: 'Le statut doit être completed, in_progress ou failed.'
        }
      }
    },
    result_details: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'test_id'],
        name: 'user_test',
        msg: "L'utilisateur participe déjà à ce test"
      }
    ]
  });
}; 