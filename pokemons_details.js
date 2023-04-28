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
      firstPokemonSpriteOfEvolutionChain
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

function getPromiseOfSpriteSource(evolutionChain, depth) {
  let nameOfPokemon;

  if (!evolutionChain.chain.evolves_to[0]) {
    pokedexEvolutionsCardElement.innerHTML = "This pokemon does not have an evolution chain !"
    pokedexEvolutionsCardElement.style.gridTemplateColumns = "1fr";
    return;
  }

  while (evolutionChain.chain.evolves_to[0]) {
    switch (depth) {
      case 0:
        nameOfPokemon = evolutionChain.chain.species.name;
        break;
      case 1:
        nameOfPokemon = evolutionChain.chain.evolves_to[0].species.name;
        break;
      case 2:
        if (!evolutionChain.chain.evolves_to[0].evolves_to[0]) {
          pokedexEvolutionsCardElement.style.gridTemplateColumns = "1fr 1fr";
          return;
        }
        nameOfPokemon =
          evolutionChain.chain.evolves_to[0].evolves_to[0].species.name;
        break;
    }
    return pokeAPI.getPokemon(nameOfPokemon).then((resultJSON) => {
      return resultJSON["sprites"]["front_default"];
    });
  }
  
}

function getEvolutionChainAndReturnSprite(evolutionChain) {
  return pokeAPI.getEvolutionChains(evolutionChain).then((resultJSON) => {
    return Promise.all([
      getPromiseOfSpriteSource(resultJSON, 0),
      getPromiseOfSpriteSource(resultJSON, 1),
      getPromiseOfSpriteSource(resultJSON, 2),
    ]);
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
