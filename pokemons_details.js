/*
 ********
 *IMPORT*
 ********
 */

import {
  createDetailsPokemonCard,
  createStatsCard,
  createEvolutionsCard,
} from "./modules/createPokemonCards.js";
import * as pokeAPI from "./modules/pokeAPI.js";

/*
 **********
 *ELEMENTS*
 **********
 */

const pokedexDetailsCardElement = document.getElementById(
  "pokedex-card-details"
);

const loaderElement = document.getElementById("loader");

const pokedexPreviousButtonElement = document.getElementById(
  "pokedex-previous-button"
);
const pokedexNextButtonElement = document.getElementById("pokedex-next-button");

const pokedexStatsCardElement = document.getElementById("pokedex-card-stats");

const pokedexEvolutionsCardElement = document.getElementById(
  "pokedex-card-evolutions"
);

const searchParams = new URL(document.location).searchParams;

/*
 ***********
 *VARIABLES*
 ***********
 */

let pokemon = searchParams.get("pokemon");
let previousPokemon = parseInt(pokemon) - 1;
let nextPokemon = parseInt(pokemon) + 1;
let currentPokemon = [];

/*
 ********************************
 *CREATE CARDS HANDLERS FUNCTION*
 ********************************
 */

function createPokemonCard(pokemon) {
  pokeAPI
    .getPokemonSpecies(pokemon)
    .then((resultJSON) =>
      createPokemonCardsFromJSON(resultJSON, resultJSON.evolution_chain.url)
    );
}

async function createPokemonCardsFromJSON(JSONResponse, evolutionsChainURL) {
  loaderElement.classList.add("pokedex-loader-animation");

  const pokemonDetails = await pokeAPI.getPokemon(pokemon);

  currentPokemon.push(pokemonDetails);
  createPokemonCards(
    returnPokemonEntry(JSONResponse),
    getEvolutionChainAndReturnSprite(evolutionsChainURL)
  );
  loaderElement.classList.remove("pokedex-loader-animation");
}

function createPokemonCards(
  pokedexEntryFromJSONResponse,
  firstPokemonSpriteOfEvolutionChain
) {
  currentPokemon.forEach((pokemon) => {
    createDetailsPokemonCard(
      pokedexDetailsCardElement,
      pokemon,
      pokemon.name,
      pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ],
      pokemon["sprites"]["front_default"],
      pokemon["sprites"]["other"]["official-artwork"]["front_default"],
      pokedexEntryFromJSONResponse
    );
    createStatsCard(pokedexStatsCardElement, pokemon);
    createEvolutionsCard(
      pokedexEvolutionsCardElement,
      firstPokemonSpriteOfEvolutionChain,
      pokemon["sprites"]["other"]["official-artwork"]["front_default"]
    );
  });
}

function returnPokemonEntry(JSONResponse) {
  const foundRightLanguage = JSONResponse.flavor_text_entries.find(
    (element) => element.language.name === "en"
  );

  if (!foundRightLanguage) {
    return "This pokemon doesn't have a description.";
  }

  let pokedexEntry = foundRightLanguage.flavor_text;

  return pokedexEntry
    .replace(pokedexEntry[pokedexEntry.indexOf("\f")], " ")
    .toLowerCase();
}

function getPokemonNames(evolutionChain) {
  let pokemonsList = [evolutionChain.species.name];
  let evolutions = evolutionChain.evolves_to;

  // ! Récursif

  pokemonsList.push(
    ...evolutions.flatMap((children) => getPokemonNames(children))
  );
  /* ! Itératif
     for (let index = 0; index < evolutions.length; index++) {
    let element = evolutions[index];
    while (element.evolves_to.length > 0) {
      pokemonsList.push(element.species.name);
      element = element.evolves_to[0];
    }
    pokemonsList.push(element.species.name);
  } */

  return pokemonsList;
}

function changePokemonCardColumnsStyle(
  pokemonArray,
  numbersOfElements,
  styleOfColumns
) {
  if (pokemonArray.length === numbersOfElements)
    pokedexEvolutionsCardElement.style.gridTemplateColumns = `${styleOfColumns}`;
}

async function getPromiseOfSpriteSource(pokemonName) {
  return await pokeAPI.getPokemon(pokemonName).then((resultJSON) => {
    return resultJSON["sprites"]["front_default"];
  });
}

function getEvolutionChainAndReturnSprite(evolutionChain) {
  return pokeAPI
    .getEvolutionChains(evolutionChain)
    .then((evolutionChainJSON) => {
      const pokemonListEvolution = getPokemonNames(
        evolutionChainJSON.chain
      ).map((name) => getPromiseOfSpriteSource(name));

      return Promise.all(pokemonListEvolution);
    });
}

if (previousPokemon === 0) {
  pokedexPreviousButtonElement.style.opacity = 0.2;
  pokedexPreviousButtonElement.style.pointerEvents = "none";
} else {
  viewPreviousAndNextPokemon(pokedexPreviousButtonElement, previousPokemon);
}

if (nextPokemon === 1011) {
  viewPreviousAndNextPokemon(pokedexNextButtonElement, 1);
} else {
  viewPreviousAndNextPokemon(pokedexNextButtonElement, nextPokemon);
}

function viewPreviousAndNextPokemon(buttonElement, pokemonId) {
  buttonElement.addEventListener("click", () => {
    window.location.href = `pokemon_details.html?pokemon=${pokemonId}`;
  });
}

createPokemonCard(pokemon);
