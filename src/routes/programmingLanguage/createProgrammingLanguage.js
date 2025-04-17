const { ProgrammingLanguage } = require("../../db/sequelize")
const { ValidationError, UniqueConstraintError } = require("sequelize")
const auth = require("../../auth/auth")

module.exports = (app) => {
    app.post("/api/programmingLanguages",(req,res) => {
        ProgrammingLanguage.create(req.body)
            .then(programmingLanguage => {
                const message = `Le language de programation ${req.body.name} a bien été crée.`
                res.json({message, data: programmingLanguage})
            })
            .catch(error  => {
                if(error instanceof ValidationError) {
                    return res.status(400).json({message: error.message, data: error})
                }
                if(error instanceof UniqueConstraintError) {
                    return res.status(400).json({message: error.message, data: error})
                }
                const message = `Le language de programation n'a pas pu être ajouter . Réessayer dans quelques instants`
                res.status(500).json({message , data: error})
            })
    })
}