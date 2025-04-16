module.exports = (sequelize, DataTypes) => {
    return sequelize.define("ProgrammingLanguage", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement:true
        },
        name: {
            type: DataTypes.STRING,
            allowNull:false,
            unique: {
                msg: "Le nom est déjà pris"
            },
            validate: {
                notEmpty: {msg: "Le nom du langage de programmation ne doit pas être vide"},
                notNull: {msg: "Le nom du langage de programmation est une propriété requise"},

            }
        }
    }, {
        timestamps: true,
        createdAt:"created_at",
        updatedAt: false
    })

}