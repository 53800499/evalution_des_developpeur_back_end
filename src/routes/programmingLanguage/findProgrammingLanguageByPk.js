const { ProgrammingLanguage } = require("../../db/sequelize")
const auth = require("../../auth/auth")

module.exports = (app) => {
    app.get("/api/programmingLanguages/:id", (req,res) => {
        ProgrammingLanguage.findByPk(req.params.id)
            .then(programmingLanguage => {
                if (programmingLanguage === null) {
                    const message ="Le language de programation demandé n'existe pas. Réessayer avecun autre identifiant";
                    return res.status(404).json({message})
                }
                const message = "Un language de programation a bien été trouvé."
                res.json({ message, data: programmingLanguage})
            })
            .catch(error  => {
                const message = `Le language de programation demandé n'a pas pu etre récupérer. Réessayer dans quelques instants`
                res.status(500).json({message , data: error})
            })
    })
}