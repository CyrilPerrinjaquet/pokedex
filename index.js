/*
 ********
 *IMPORT*
 ********
 */

import { createPokemonCard } from "./modules/createPokemonCards.js";
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

const scrollTopAncorElement = document.getElementById(
  "pokedex-scroll-to-top-anchor"
);

/*
 ***********
 *VARIABLES*
 ***********
 */

let nextSetOfPokemons = "";
let currentPokemons = [];
/*
 *******************
 *POKEDEX FUNCTIONS*
 *******************
 */

function getSetOfPokemons() {
  pokeAPI
    .getPokemons()
    .then((result) => createNewPokemonCardsFromJSON(result));
}

function loadMorePokemons() {
  addCSSAnimationClassToElement();
  pokeAPI
    .getNextSetOfPokemons(nextSetOfPokemons)
    .then((result) => createNewPokemonCardsFromJSON(result));
}

function addCSSAnimationClassToElement() {
  loaderElement.classList.add("pokedex-loader-animation");
  pokedexLoadMoreButtonElement.style.display = "none";
  scrollTopAncorElement.style.display = "none";
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
  scrollTopAncorElement.style.display = "block";

  if (window.innerWidth > 1000) {
    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight - 1310,
        behavior: "smooth",
      }),
        200;
    });
    return;
  } 
    setTimeout(() => {
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight - 3560,
        behavior: "smooth",
      }),
        200;
    });
    return;
}

function createPokemonCards() {
  currentPokemons.forEach((pokemon) =>
    createPokemonCard(
      pokedexListElement,
      pokemon,
      pokemon.name,
      pokemon.sprites.front_default
    )
  );
}

/*
 *****************
 *SEARCH FUNCTION*
 *****************
 */

async function searchForAPokemon() {
  pokedexListElement.innerHTML = "";
  currentPokemons = [];
  addCSSAnimationClassToElement();
  if (searchElement.value.toLowerCase() != "".trim()) {
    const pokemonDetails = await pokeAPI.getPokemon(
      searchElement.value.toLowerCase()
    );
    currentPokemons.push(pokemonDetails);
    loaderElement.classList.remove("pokedex-loader-animation");

    createPokemonCards();

    searchElement.value = "".trim();
  } else {
    getSetOfPokemons();
  }

  if (currentPokemons.length === 1) {
    pokedexLoadMoreButtonElement.style.display = "none";
  }
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

scrollTopAncorElement.onclick = window.scrollTo({
  top: 0,
  left: 0,
  behavior: "smooth",
});

/*
 ***********************
 *MAIN POKEDEX FUNCTION*
 ***********************
 */

getSetOfPokemons();
