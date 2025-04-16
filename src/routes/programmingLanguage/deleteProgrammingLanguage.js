const { ProgrammingLanguage } = require("../../db/sequelize")
const auth = require("../../auth/auth")

module.exports = (app) => {
    app.delete("/api/programmingLanguages/:id", (req,res) => {
        ProgrammingLanguage.findByPk(req.params.id).then(programmingLanguage => {
            if (programmingLanguage === null) {
                const message ="Le language de programation demandé n'existe pas. Réessayer avecun autre identifiant";
                return res.status(404).json({message})
            }
            const programmingLanguageDeleted = programmingLanguage;
            return ProgrammingLanguage.destroy({
                where: {id: programmingLanguage.id}
            })
            .then(_ => {
                const message = `Le language de programation à l'identifiant ${programmingLanguageDeleted.id} a bien été supprimer.`
                res.json({message, data: programmingLanguageDeleted})
            })
        })
        .catch(error  => {
            const message = `La liste des languages de programation n'a pas pu être récupérée. Réessayer dans quelques instants`
            res.status(500).json({message , data: error})
        })
    })
}