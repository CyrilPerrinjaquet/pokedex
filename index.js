/*
 ********
 *IMPORT*
 ********
 */

import { constructTheCardWithAllInformation } from "./modules/createPokemonCard.js";
import * as pokeAPI from "./modules/pokeAPI.js";

/*
 **********
 *ELEMENTS*
 **********
 */

const pokedexListElement = document.getElementById("pokedex-list");
const pokedexLoadMoreButtonElement =
  document.getElementById("loadMorePokemons");
const searchPokemonButtonElement = document.getElementById(
  "searchPokemonButton"
);
const searchElement = document.getElementById("search");

const loaderElement = document.getElementById("loader");

/*
 ***********
 *VARIABLES*
 ***********
 */

let nextSetOfPokemons = "";
let currentPokemons = [];
let currentPokemonDetail = [];
/*
 *******************
 *POKEDEX FUNCTIONS*
 *******************
 */

function getSetOfPokemons() {
  pokeAPI.getPokemons().then((result) => {
    createNewPokemonCardsFromJSON(result);
  });
}

function loadMorePokemons() {
  addCSSAnimationClassToElement();
  pokeAPI.getNextSetOfPokemons(nextSetOfPokemons).then((result) =>
    createNewPokemonCardsFromJSON(result)
  );
}

function addCSSAnimationClassToElement() {
  loaderElement.classList.add("pokedex-loader-animation");
  pokedexLoadMoreButtonElement.style.display = "none";
}

async function createNewPokemonCardsFromJSON(pokemonsJSON) {
  currentPokemons = [];
  nextSetOfPokemons = pokemonsJSON.next;
  addCSSAnimationClassToElement();
  for (const pokemon of pokemonsJSON.results) {
    const pokemonDetails = await pokeAPI.getPokemon(pokemon.name);
    currentPokemons.push(pokemonDetails);
  }
  loaderElement.classList.remove("pokedex-loader-animation");

  if (pokemonsJSON.next === null) {
    pokedexLoadMoreButtonElement.style.display = "none";
  }
  createPokemonCards();
  pokedexLoadMoreButtonElement.style.display = "block";
}

function createPokemonCards() {
  currentPokemons.forEach((pokemon) =>
    constructTheCardWithAllInformation(
      pokedexListElement,
      pokemon,
      pokemon.name,
      pokemon.sprites.front_default
    )
  );
}

/* function createPokemonDetails(idOfPokemon, idOfHTMLElement) {
  currentPokemonDetail = [];
  const pokemon = pokeAPI.getPokemon(idOfPokemon);
  currentPokemonDetail.push(pokemon);
  createPokemonDetailCard(idOfHTMLElement);
} */

/*
 *****************
 *SEARCH FUNCTION*
 *****************
 */

async function searchForAPokemon() {
  pokedexListElement.innerHTML = "";
  currentPokemons = [];
  addCSSAnimationClassToElement();
  const pokemonDetails = await pokeAPI.getPokemon(searchElement.value.toLowerCase());

  currentPokemons.push(pokemonDetails);
  loaderElement.classList.remove("pokedex-loader-animation");

  createPokemonCards();
  if (currentPokemons.length === 1) {
    pokedexLoadMoreButtonElement.style.display = "none";
  }
}

/*
 *************************************
 *CONSTRUCTION OF THE CARDS FUNCTIONS*
 *************************************
 */

// For details of the pokemon
function constructDetailCard(
  idOfElement,
  pokemonDetails,
  pokemonName,
  pokemonImage,
  containerOfTheSecondDiv
) {
  idOfElement.innerHTML += `<div class="pokedex-details-id-of-pokemon"><p>N°${pokemonDetails.id}</p></div><div><img src="${pokemonImage}" alt="animated image of ${pokemonName}" style="image-rendering: pixelated;" /></div><div class="pokedex-details-name-and-types-container"><div><p>${pokemonName}</p><p class="pokedex-type-icon" id="emoji-pokemon-${pokemonDetails.id}"></p><div class="pokedex-type-word-container" id="pokemon-type-${pokemonDetails.id}"><p>${pokemonDetails.types[0].type.name}</p></div><div><p>${containerOfTheSecondDiv}</p></div></div><div><p>${pokemonDetails.flavor_text_entries.flavor_text}</p></div></div>`;
  applySecondPokemonTypeIfExists(pokemonDetails);
  applyPokemonTypes(
    pokemonDetails.types[0].type.name,
    "pokemon-type-",
    pokemonDetails.id
  );
}

/*
 ****************
 *EVENT FUNCTION*
 ****************
 */

searchPokemonButtonElement.onclick = searchForAPokemon;
searchElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchForAPokemon();
  }
});

pokedexLoadMoreButtonElement.onclick = loadMorePokemons;

/*
 ***********************
 *MAIN POKEDEX FUNCTION*
 ***********************
 */

getSetOfPokemons();
