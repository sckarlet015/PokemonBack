const { Pokemon, Tipo } = require("../db.js")
const axios = require("axios");

const URL = "https://pokeapi.co/api/v2/type"

async function tiposApi(){
    try {
        const responseApi = await axios.get(URL);
        const tiposDePokemon = responseApi.data.results;
        tiposDePokemon.forEach(async (tipo) => {
            const tipoId = tipo.url.split('/')[6]; 
            await Tipo.create({
              id: tipoId,
              nombre: tipo.name
            });
          });
        let response = {
            message: "Tipos de Pokemon guardados en la base de datos"
        }
        return response
    } catch (error) {
        let response = {
            error
        }
        return response
    }
}

async function tipos(){
try {
    let response = await Tipo.findAll()
    return response
} catch (error) {
    let response = {
        error
    }
    return response
}}

async function pokeByType(type) {
    try {
        let response = await Tipo.findOne({
            where: {nombre: type},
            include: {model: Pokemon}
        })
        return response
    } catch (error) {
        throw error;
      }
  }
module.exports = {tiposApi, tipos, pokeByType};