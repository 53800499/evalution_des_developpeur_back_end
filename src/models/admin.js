module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Admin', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
          msg: 'Cet email est déjà utilisé.'
        },
        validate: {
          isEmail: { msg: 'L\'email doit être une adresse valide.' },
          notEmpty: { msg: 'L\'email ne peut pas être vide.' },
          notNull: { msg: 'L\'email est requis.' }
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [8, 255],
            msg: 'Le mot de passe doit contenir entre 8 et 255 caractères.'
          },
          notEmpty: { msg: 'Le mot de passe ne peut pas être vide.' },
          notNull: { msg: 'Le mot de passe est requis.' }
        }
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: {
            args: [2, 255],
            msg: 'Le nom doit contenir entre 2 et 255 caractères.'
          },
          notEmpty: { msg: 'Le nom ne peut pas être vide.' },
          notNull: { msg: 'Le nom est requis.' }
        }
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  };  