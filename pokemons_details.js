import {
  createDetailsPokemonCard,
  createStatsCard,
} from "./modules/createPokemonCards.js";
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

const searchParams = new URL(document.location).searchParams;

let pokemon = searchParams.get("pokemon");
let previousPokemon = parseInt(pokemon) - 1;
let nextPokemon = parseInt(pokemon) + 1;
let currentPokemon = [];

function createPokemonCard(pokemon) {
  pokeAPI
    .getPokemonSpecies(pokemon)
    .then((resultJSON) => retrievePokedexEntry(resultJSON));
}

async function retrievePokedexEntry(JSONResponse) {
  //TODO CHANGER NOM DE FONCTION
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
      pokemon["sprites"]["other"]["official-artwork"]["front_default"],
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

if (previousPokemon === 0) {
  pokedexPreviousButtonElement.style.opacity = 0.2;
  pokedexPreviousButtonElement.style.pointerEvents = "none";
} else {
  pokedexPreviousButtonElement.addEventListener("click", () => {
    window.location.href = `pokemon_details?pokemon=${previousPokemon}`;
  });
}

if (nextPokemon === 1011) {
  pokedexNextButtonElement.addEventListener("click", () => {
    window.location.href = `pokemon_details?pokemon=1`;
  });

} else {
  pokedexNextButtonElement.addEventListener("click", () => {
    window.location.href = `pokemon_details?pokemon=${nextPokemon}`;
  });
}

createPokemonCard(pokemon);
