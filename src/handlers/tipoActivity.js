const {tiposApi, tipos, pokeByType} = require("../controllers/tipoController")

const getTiposApi = async(req, res) => {
    try {
        let response = await tiposApi()
        console.log(response);
    } catch (error) {
        let response = {
            error
        }
        res.status(204).json(response)
    }
}

const getAllTipos = async(req, res) => {
    try {
        let response = await tipos()
        res.status(200).json(response)
    } catch (error) {
        let response = {
            error
        }
        res.status(204).json(response)
    }
}

const getPokemonByType = async(req, res) => {
    const {type} = req.params;
    try {
        let response = await pokeByType(type)
        res.status(200).json(response)
    } catch (error) {
        let response = {
            error
        }
        res.status(204).json(response)
    }
}

module.exports = {getTiposApi, getAllTipos, getPokemonByType}