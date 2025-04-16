const { ProgrammingLanguage } = require("../../db/sequelize")
const { Op } = require("sequelize")
const auth = require("../../auth/auth")


module.exports = (app) => {
    app.get('/api/programmingLanguages', (req,res) => {
        if(req.query.name) {
            const limit = parseInt(req.query.limit) || 5
            const name = req.query.name
            if (name.length < 2){
                const message = "Le terme de recherche doit contenir au minimun deux caractères"
                return res.status(400).json({message})
            } 
            return ProgrammingLanguage.findAndCountAll({
                where: {
                    name: { // 'name est la propriéter du modèle programmingLanguage
                        [Op.like]: `%${name}%` // name est le critère de la reccherche
                    }
                },
                order: ["id"],
                limit: limit
            })
            .then(({ count, rows } ) => {
                const message = `Il y a ${count} languages de programations qui correspondent au terme de recherche ${name}`
                res.json({message, data: rows})
            })
        }
        else{
            ProgrammingLanguage.findAll({order: ["name"]})
            .then(programmingLanguages => {
                const message = "la liste des languages de programations a bien été récuprée."
                res.json({message, data: programmingLanguages})
            })
            .catch(error  => {
                const message = `La liste des languages de programations n'a pas pu être récupérée. Réessayer dans quelques instants`
                res.status(500).json({message , data: error})
            })
        }

    })
}