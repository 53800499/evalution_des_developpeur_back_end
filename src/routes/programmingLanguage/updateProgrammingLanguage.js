const { ProgrammingLanguage } = require("../../db/sequelize")
const { ValidationError,UniqueConstraintError} = require("sequelize")
const auth = require("../../auth/auth")

module.exports = (app) => {
    app.put("/api/programmingLanguages/:id", (req,res) => {
        const id = req.params.id
        ProgrammingLanguage.update(req.body, {
            where: {id: id} 
        })
        .then(_ => {
            return ProgrammingLanguage.findByPk(id).then(programmingLanguage => {
                if (programmingLanguage === null) {
                    const message ="Le language de programation demandé n'existe pas. Réessayer avecun autre identifiant";
                    return res.status(404).json({message})
                }
                const message = `Le language de programation ${programmingLanguage.name} a bien été modifier.`
                res.json({message, data: programmingLanguage})
            })
        })
        .catch(error  => {
            if(error instanceof ValidationError) {
                return res.status(400).json({message: error.message, data: error})
            }
            if(error instanceof UniqueConstraintError) {
                return res.status(400).json({message: error.message, data: error})
            }
            const message = `Le language de programation n'a pas pu être modifiée. Réessayer dans quelques instants`
            res.status(500).json({message , data: error})
        })
    })
}