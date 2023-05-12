import {
  createDetailsPokemonCard,
  createStatsCard,
} from "./modules/createPokemonCards.js";
import * as pokeAPI from "./modules/pokeAPI.js";

const pokedexDetailsCardElement = document.getElementById(
  "pokedex-card-details"
);


const loaderElement = document.getElementById("loader");

const pokedexStatsCardElement = document.getElementById("pokedex-card-stats");

const searchParams = new URL(document.location).searchParams;
const pokemon = searchParams.get("pokemon");

let currentPokemon = [];

function createPokemonCard() {
  pokeAPI
    .getPokemonSpecies(pokemon)
    .then((resultJSON) => retrievePokedexEntry(resultJSON));
}

async function retrievePokedexEntry(JSONResponse) {
  // CHANGER NOM DE FONCTION

  loaderElement.classList.add("pokedex-loader-animation");
  const pokemonDetails = await pokeAPI.getPokemon(pokemon);
  currentPokemon.push(pokemonDetails);
  createPokemonCards(returnPokemonEntry(JSONResponse));
  loaderElement.classList.remove("pokedex-loader-animation");
}

function createPokemonCards(pokedexEntryFromJSONResponse) {
  currentPokemon.forEach((pokemon) => {
    createDetailsPokemonCard(
      pokedexDetailsCardElement,
      pokemon,
      pokemon.name,
      pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ],
      pokemon["sprites"]["front_default"],
      pokedexEntryFromJSONResponse
    );
    createStatsCard(pokedexStatsCardElement, pokemon);
    /* createStatsCards(), createEvolutionCards() */
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

createPokemonCard();
