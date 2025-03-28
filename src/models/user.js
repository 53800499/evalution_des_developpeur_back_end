module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      unique_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 100],
          is: /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/u,
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Le rôle est requis' },
          isIn: {
            args: [['developer', 'admin', 'recruiter']],
            msg: "Le rôle doit être 'developer', 'admin' ou 'recruiter'"
          }
        }
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      skills: {
        type: DataTypes.JSON,
        defaultValue: [],
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};
