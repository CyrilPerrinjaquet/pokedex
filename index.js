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
let isLoading = false;

/*
 *******************
 *POKEDEX FUNCTIONS*
 *******************
 */

function getSetOfPokemons() {
  isLoading = true;
  pokeAPI.getPokemons()
    .then((result) => createNewPokemonCardsFromJSON(result))
    .finally(() => {
      isLoading = false;
    });
}

function loadMorePokemons() {
  if (isLoading || !nextSetOfPokemons) return;
  isLoading = true;
  addCSSAnimationClassToElement();
  pokeAPI
    .getNextSetOfPokemons(nextSetOfPokemons)
    .then((result) => createNewPokemonCardsFromJSON(result))
    .finally(() => {
      isLoading = false;
    });
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
  } else {
    pokedexLoadMoreButtonElement.style.display = "block";
  }
  createPokemonCards();
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
  const searchTerm = searchElement.value.toLowerCase().trim();
  if (!searchTerm) return;

  pokedexListElement.innerHTML = "";
  currentPokemons = [];
  addCSSAnimationClassToElement();

  try {
    const pokemonDetails = await pokeAPI.getPokemon(searchTerm);
    if (!pokemonDetails) {
      alert("The Pokemon doesn't exist");
      loaderElement.classList.remove("pokedex-loader-animation");
      return;
    }
    currentPokemons.push(pokemonDetails);
    loaderElement.classList.remove("pokedex-loader-animation");
    createPokemonCards();
    pokedexLoadMoreButtonElement.style.display = "none";
  } catch (error) {
    alert("The Pokemon doesn't exist");
    loaderElement.classList.remove("pokedex-loader-animation");
  } finally {
    searchElement.value = "";
  }
}

/*
 ****************
 *EVENT FUNCTION*
 *****************
 */

searchPokemonButtonElement.onclick = searchForAPokemon;
searchElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchForAPokemon();
  }
});

pokedexLoadMoreButtonElement.onclick = loadMorePokemons;

function handleScroll() {
  if (window.scrollY > 300) {
    scrollTopAncorElement.style.display = "block";
  } else {
    scrollTopAncorElement.style.display = "none";
  }
}

window.addEventListener("scroll", handleScroll);

scrollTopAncorElement.onclick = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};

/*
 ***********************
 *INFINITE SCROLL*
 ***********************
 */

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMorePokemons();
    }
  },
  { threshold: 0.1 }
);

observer.observe(pokedexLoadMoreButtonElement);

/*
 ***********************
 *MAIN POKEDEX FUNCTION*
 ***********************
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
handleScroll();
