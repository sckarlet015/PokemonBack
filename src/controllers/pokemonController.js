const { Pokemon, Tipo } = require("../db.js")
const axios = require("axios");

const URL = "https://pokeapi.co/api/v2/pokemon/";

async function getFirsAllPokemonAPI() {
  let arrayPokemons = [];
  try {
    for (let i = 1; i <= 50; i++) {
      const pokemonData = await dataPokemon(i);
      const newPokemon = await Pokemon.create(pokemonData);

      const tipo1 = pokemonData.tipo1 ? await Tipo.findOne({ where: { nombre: pokemonData.tipo1 } }) : null;
      const tipo2 = pokemonData.tipo2 ? await Tipo.findOne({ where: { nombre: pokemonData.tipo2 } }) : null;

      if (tipo1) {
        await tipo1.addPokemons(newPokemon);
      }
      if (tipo2) {
        await tipo2.addPokemons(newPokemon);
      }
      arrayPokemons.push(newPokemon);
    }
    return arrayPokemons;
  } catch (error) {
    throw error;
  }
}

async function dataPokemon(pokeId) {
  try {
    const response = await axios.get(`${URL}${pokeId}`);
    const { name, id, stats, sprites, height, weight, types } = response.data;
    const statsObject = stats.reduce((obj, stat) => {
      obj[stat.stat.name] = stat.base_stat;
      return obj;
    }, {});
    return {
      name,
      apiID: id,
      vida: statsObject.hp,
      ataque: statsObject.attack,
      defensa: statsObject.defense,
      velocidad: statsObject.speed,
      altura: height,
      peso: weight,
      imageFront: sprites.versions["generation-v"]["black-white"].animated.front_default,
      imageBack: sprites.versions["generation-v"]["black-white"].animated.back_default,
      imageSVG: sprites.other.dream_world.front_default,
      tipo1: types[0].type.name,
      tipo2: types[1]?.type.name,
    };
  } catch (error) {
    throw error;
  }
}

async function allPokemon() {
  try {
    const pokemons = await Pokemon.findAll({
      include: { model: Tipo }
    });
    return pokemons
  } catch (error) {
    throw error;
  }
}

async function pokemonById(pokeId) {
  try {
    let poke = await Pokemon.findOne({
      where: { apiID: pokeId },
      include: { model: Tipo },
    });

    if (!poke) {
      const response = await axios.get(`${URL}${pokeId}`);
      const { name, id, stats, sprites, height, weight, types } = response.data;
      const statsObject = stats.reduce((obj, stat) => {
        obj[stat.stat.name] = stat.base_stat;
        return obj;
      }, {});

      poke = await Pokemon.create({
        name,
        apiID: id,
        vida: statsObject.hp,
        ataque: statsObject.attack,
        defensa: statsObject.defense,
        velocidad: statsObject.speed,
        altura: height,
        peso: weight,
        imageFront: sprites.versions["generation-v"]["black-white"].animated.front_default,
        imageBack: sprites.versions["generation-v"]["black-white"].animated.back_default,
        imageSVG: sprites.other.dream_world.front_default,
      });

      if (types?.length === 1) {
        let tipo = types?.[0].type.name;
        const tipo1 = types?.[0].type.name ? await Tipo.findOne({ where: { nombre: tipo } }) : null;
        if (tipo1?.id) {
          await tipo1.addPokemons(poke);
        }
      }
      if (types?.length === 2) {
        let tipo = types?.[0].type.name;
        let otroTipo = types?.[1]?.type.name;
        const tipo1 = types?.[0].type.name ? await Tipo.findOne({ where: { nombre: tipo } }) : null;
        const tipo2 = types?.[1].type.name ? await Tipo.findOne({ where: { nombre: otroTipo } }) : null;
        if (tipo1?.id) {
          await tipo1.addPokemons(poke);
        }
        if (tipo2?.id) {
          await tipo2.addPokemons(poke);
        }
      }

      try {
        const newPoke = await Pokemon.findByPk(poke.id, {
          include: { model: Tipo },
        });
        return newPoke;
      } catch (error) {
        throw error;
      }
    }

    return poke;
  } catch (error) {
    throw error;
  }
};

async function pokeByName(name) {
  try {
    if (!name) {
      return {
        message: "Nombre de Pokémon no válido",
      };
    }

    let poke = await Pokemon.findOne({
      where: { name: name },
      include: { model: Tipo },
    });

    if (!poke) {
      try {
        console.log("Estoy buscando por nombre");
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const { name: pokeName, id, stats, sprites, height, weight, types } = response.data;
        // Cambio name por pokeName para evitar conflictos con el parámetro name
        const statsObject = stats.reduce((obj, stat) => {
          obj[stat.stat.name] = stat.base_stat;
          return obj;
        }, {});
        poke = await Pokemon.create({
          name: pokeName, // Usamos pokeName aquí para guardar el nombre correcto
          apiID: id,
          vida: statsObject.hp,
          ataque: statsObject.attack,
          defensa: statsObject.defense,
          velocidad: statsObject.speed,
          altura: height,
          peso: weight,
          imageFront: sprites.versions["generation-v"]["black-white"].animated.front_default,
          imageBack: sprites.versions["generation-v"]["black-white"].animated.back_default,
          imageSVG: sprites.other.dream_world.front_default,
        });

        if (types?.length === 1) {
          let tipo = types?.[0].type.name;
          const tipo1 = types?.[0].type.name ? await Tipo.findOne({ where: { nombre: tipo } }) : null;
          if (tipo1?.id) {
            await tipo1.addPokemons(poke);
          }
        }
        if (types?.length === 2) {
          let tipo = types?.[0].type.name;
          let otroTipo = types?.[1]?.type.name;
          const tipo1 = types?.[0].type.name ? await Tipo.findOne({ where: { nombre: tipo } }) : null;
          const tipo2 = types?.[1].type.name ? await Tipo.findOne({ where: { nombre: otroTipo } }) : null;
          if (tipo1?.id) {
            await tipo1.addPokemons(poke);
          }
          if (tipo2?.id) {
            await tipo2.addPokemons(poke);
          }
        }

        try {
          const newPoke = await Pokemon.findByPk(poke.id, {
            include: { model: Tipo },
          });
          return newPoke;
        } catch (error) {
          throw error;
        }
      } catch (error) {
        throw error;
      }
    }
    return poke;
  } catch (error) {
    throw error;
  }
}

async function createPokemon(pokeData) {
  try {
    const { name, apiID, vida, ataque, defensa, velocidad, altura, peso, imageFront, imageBack, imageSVG, tipo1, tipo2 } = pokeData;

    const newPokemon = await Pokemon.create({
      name,
      apiID,
      vida,
      ataque,
      defensa,
      velocidad,
      altura,
      peso,
      imageFront,
      imageBack,
      imageSVG,
    });

    const tipo1Instance = await Tipo.findOrCreate({ where: { nombre: tipo1 } });
    await newPokemon.addTipo(tipo1Instance[0]);

    if (tipo2) {
      const tipo2Instance = await Tipo.findOrCreate({ where: { nombre: tipo2 } });
      await newPokemon.addTipo(tipo2Instance[0]);
    }

    const newPoke = await Pokemon.findByPk(newPokemon.id, {
      include: { model: Tipo },
    });

    return newPoke;
  } catch (error) {
    throw error;
  }
}


module.exports = { getFirsAllPokemonAPI, allPokemon, pokemonById, pokeByName, createPokemon }

