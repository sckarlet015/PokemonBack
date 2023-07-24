const express = require('express');
const {getAllPokemon, getPokemonById, getPokemonByName, postPokemon} = require("../handlers/pokemonActivity")

const pokemonRouter = express.Router();

pokemonRouter.get("/name", getPokemonByName)
pokemonRouter.get("/", getAllPokemon)
pokemonRouter.get("/:id", getPokemonById)
pokemonRouter.post("/post", postPokemon)
module.exports = pokemonRouter;