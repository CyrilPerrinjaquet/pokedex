import {
  createDetailsPokemonCard,
  createStatsCard,
  createEvolutionsCard,
} from "./modules/createPokemonCards.js";
import { fetchAPI } from "./modules/fetchUtils.js";
import * as pokeAPI from "./modules/pokeAPI.js";

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

let pokemon = searchParams.get("pokemon");
let previousPokemon = parseInt(pokemon) - 1;
let nextPokemon = parseInt(pokemon) + 1;
let currentPokemon = [];

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
    getEvolutionChainAndReturnFirstSprite(evolutionsChainURL),
    getEvolutionChainAndReturnSecondSprite(evolutionsChainURL),
    getEvolutionChainAndReturnThirdSprite(evolutionsChainURL)
  );
  loaderElement.classList.remove("pokedex-loader-animation");
}

function createPokemonCards(
  pokedexEntryFromJSONResponse,
  firstPokemonSpriteOfEvolutionChain,
  secondPokemonSpriteOfEvolutionChain,
  thirdPokemonSpriteOfEvolutionChain
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
      secondPokemonSpriteOfEvolutionChain,
      thirdPokemonSpriteOfEvolutionChain
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

function returnFirstSpriteOfPokemonEvolution(evolutionChain) {
  return pokeAPI
    .getPokemon(evolutionChain.chain.species.name)
    .then((resultJSON) => resultJSON["sprites"]["front_default"]);
}

function returnSecondSpriteOfPokemonEvolution(evolutionChain) {
  return pokeAPI
    .getPokemon(evolutionChain.chain.evolves_to[0].species.name)
    .then((resultJSON) => resultJSON["sprites"]["front_default"]);
}

function returnThirdSpriteOfPokemonEvolution(evolutionChain) {
  return pokeAPI
    .getPokemon(evolutionChain.chain.evolves_to[0].evolves_to[0].species.name)
    .then((resultJSON) => resultJSON["sprites"]["front_default"]);
}

function getEvolutionChainAndReturnFirstSprite(evolutionChain) {
  pokeAPI.getEvolutionChains(evolutionChain).then((resultJSON) => {
    returnFirstSpriteOfPokemonEvolution(resultJSON);
  });
}

function getEvolutionChainAndReturnSecondSprite(evolutionChain) {
  pokeAPI.getEvolutionChains(evolutionChain).then((resultJSON) => {
    returnSecondSpriteOfPokemonEvolution(resultJSON);
  });
}

function getEvolutionChainAndReturnThirdSprite(evolutionChain) {
  pokeAPI.getEvolutionChains(evolutionChain).then((resultJSON) => {
    returnThirdSpriteOfPokemonEvolution(resultJSON);
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
    window.location.href = `pokemon_details?pokemon=${pokemonId}`;
  });
}

createPokemonCard(pokemon);
