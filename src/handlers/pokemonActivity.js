const {getFirsAllPokemonAPI, allPokemon, pokemonById, pokeByName, createPokemon} = require("../controllers/pokemonController");

const getFirsAllPokeApi = async (req, res) => {
    try {
        await getFirsAllPokemonAPI()
        let response = {
            message: "Pokemons guardados con exito"
        }
        console.log(response);
    } catch (error) {
        let response = {
            error
        }
        console.log(`Error con mensaje: ${response.error}`);
    }
}

const getAllPokemon = async(req, res) => {
    try {
        let response = await allPokemon()
        res.status(200).json(response)
    } catch (error) {
        let response = {
            error
        }
        res.status(204).json(response)
    }
}

const getPokemonById = async(req, res) => {
    const { id } = req.params;
    try {
        let response = await pokemonById(id)
        console.log(response);
        res.status(200).json(response)
    } catch (error) {
        let response = {
            error
        }
        res.status(204).json(response)
    }
}

const getPokemonByName = async(req, res) => {
    const { name } = req.query;
    try {
        let response = await pokeByName(name)
        res.status(200).json(response)
    } catch (error) {
        let response = {
            error
        }
        res.status(204).json(response)
    }
}

const postPokemon = async(req, res) => {
    let poke = req.body
    try {
        let response = await createPokemon(poke)
        res.status(200).json(response) 
    } catch (error) {
        let response = {
            error
        }
        res.status(204).json(response)
    }
}

module.exports = {getFirsAllPokeApi, getAllPokemon, getPokemonById, getPokemonByName, postPokemon};