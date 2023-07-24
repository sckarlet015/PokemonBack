const express = require('express');
const { getAllTipos, getPokemonByType } = require('../handlers/tipoActivity');

const tiposRouter = express.Router()

tiposRouter.get("/", getAllTipos)
tiposRouter.get("/:type", getPokemonByType)

module.exports = tiposRouter