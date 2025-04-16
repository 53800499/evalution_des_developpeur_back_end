module.exports = (sequelize, DataTypes) => {
  return sequelize.define('CodeTest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Le nom du test ne peut pas être vide.' },
        notNull: { msg: 'Le nom du test est requis.' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La description du test ne peut pas être vide.' },
        notNull: { msg: 'La description du test est requise.' }
      }
    },
    difficulty: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La difficulté du test ne peut pas être vide.' },
        notNull: { msg: 'La difficulté du test est requise.' },
        isIn: {
          args: [['easy', 'medium', 'hard']],
          msg: 'La difficulté doit être soit easy, medium ou hard.'
        }
      }
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le langage du test est requis.' }
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
