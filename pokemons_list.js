/*
 **********
 *ELEMENTS*
 **********
 */

const POKE_API_BASE_URL = "https://pokeapi.co/api/";
const VERSION = "v2";

const pokemonURL = POKE_API_BASE_URL + VERSION + "/pokemon";

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

/*
 *******************
 *POKEDEX FUNCTIONS*
 *******************
 */

function getSetOfPokemons() {
  getPokemons().then((result) => {
    createNewPokemonCardsFromJSON(result);
  });
}

/*
* THIS IS A TEST, I KEEPING IT BECAUSE IT IS THE ONLY SOLUTION I FOUND 

function functionLikeNewPokemonCardsFromJSONButNotTheSame() {
  fetchHTMLFile("pokemon_details.html", { method: "GET" }).then((data) => {
    const parser = new DOMParser();
    const responseDocument = parser.parseFromString(data, "text/html");
    getSetOfPokemons().then((result) => {
      constructDetailCard(responseDocument.getElementById("pokedex-card-details"), result, "", "", "", "")
    })
  });
} 
*/

function loadMorePokemons() {
  addCSSAnimationClassToElement();
  getNextSetOfPokemons(nextSetOfPokemons).then((result) =>
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
    const pokemonDetails = await getPokemon(pokemon.name);
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
      pokemon,
      pokemon.name,
      pokemon["sprites"]["front_default"],
      returnTheContainersSecondType(pokemon)
    )
  );
}

/*
 *****
 *API*
 *****
 */

/**
 * Fetches the given URL with an fetch method
 * @param {string} URL
 * @param {object} options
 * @returns the response in JSON format of the fetched URL
 */
async function fetchAPI(URL, options) {
  const response = await fetch(URL, options);
  if (response.ok) {
    return response.json();
  } else {
    alert("ERROR");
  }
}

async function fetchHTMLFile(file, options) {
  const response = await fetch(file, options);
  if (response.ok) {
    return response.text();
  } else {
    alert("ERROR");
  }
}

/**
 * Calls the function fetchAPI() with the pokemonURL constant and with the method "GET"
 * @returns The response in JSON of the pokemonURL
 */
function getPokemons() {
  return fetchAPI(pokemonURL, { method: "GET" });
}

/**
 * Calls the function fetchAPI() with the nextURL parameter and with the method "GET"
 * The nextURL parameter refers to the url given by the api pointing to the next of comming pokemons
 * @returns The response in JSON of the nextURL
 */
function getNextSetOfPokemons(nextURL) {
  return fetchAPI(nextURL, { method: "GET" });
}

function getPokemon(nameOfPokemon) {
  return fetchAPI(`${pokemonURL}/${nameOfPokemon}`, { method: "GET" });
}

function getAbilities(nameOfPokemon) {
  return fetchAPI(`${POKE_API_BASE_URL}/${VERSION}/ability/${nameOfPokemon}`, {
    method: "GET",
  });
}
function getCharacteristic(nameOfPokemon) {
  return fetchAPI(
    `${POKE_API_BASE_URL}/${VERSION}/characteristic/${nameOfPokemon}`,
    { method: "GET" }
  );
}

function getPokemonSpecies() {
  return fetchAPI(
    `${POKE_API_BASE_URL}/${VERSION}/pokemon-species/${nameOfPokemon}`,
    { method: "GET" }
  );
}

function returnTheContainersSecondType(result) {
  return result.types[1] === undefined
    ? ""
    : '<div class="pokedex-type-word-container" id="second-pokemon-type-' +
        result.id +
        '"><p>' +
        result.types[1].type.name +
        "</p></div>";
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
  const pokemonDetails = await getPokemon(searchElement.value.toLowerCase());

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

function constructTheCardWithAllInformation(
  pokemonDetails,
  pokemonName,
  pokemonImage,
  containerOfTheSecondDiv
) {
  pokedexListElement.innerHTML += `<div> class="pokedex-card-container" id="${pokemonDetails.id}"><a href="pokemon_details.html#${pokemonDetails.id}"><div class="pokedex-card-info"><div><p>N°${pokemonDetails.id}</p></div><p>${pokemonName}</p><img src="${pokemonImage}" alt="pokemon-image of ${pokemonName}"/><div><p class="pokedex-type-icon" id="emoji-pokemon-${pokemonDetails.id}"></p><div class="pokedex-type-word-container" id="pokemon-type-${pokemonDetails.id}"><p>${pokemonDetails.types[0].type.name}</p></div>${containerOfTheSecondDiv}</div></div></div>`;
  applySecondPokemonTypeIfExists(pokemonDetails);
  applyPokemonTypes(
    pokemonDetails.types[0].type.name,
    "pokemon-type-",
    pokemonDetails.id
  );
}

function constructDetailCard(
  idOfElement,
  pokemonDetails,
  pokemonName,
  pokemonImage,
  containerOfTheSecondDiv
) {
  idOfElement.innerHTML += `<div class="pokedex-details-id-of-pokemon"><p>N°${pokemonDetails.id}</p></div><div><img src="${pokemonImage}" alt="animated image of ${pokemonName}" style="image-rendering: pixelated;" /></div><div class="pokedex-details-name-and-types-container"><div><p>${pokemonName}</p><p class="pokedex-type-icon" id="emoji-pokemon-${pokemonDetails.id}"></p><div class="pokedex-type-word-container" id="pokemon-type-${pokemonDetails.id}"><p>${pokemonDetails.types[0].type.name}</p></div><div><p>${containerOfTheSecondDiv}</p></div></div><div><p>${pokemonDetails}</p></div></div>` 
  applySecondPokemonTypeIfExists(pokemonDetails);
  applyPokemonTypes(
    pokemonDetails.types[0].type.name,
    "pokemon-type-",
    pokemonDetails.id
  );
}

function applySecondPokemonTypeIfExists(pokemonDetails) {
  if (pokemonDetails.types[1] != undefined) {
    applyPokemonTypes(
      pokemonDetails.types[1].type.name,
      "second-pokemon-type-",
      pokemonDetails.id
    );
  }
}

function applyTheBackgroundColor(nameOfType, whichPokemonId, pokemonId) {
  let lastElementFromArray = document.getElementById(
    whichPokemonId + pokemonId
  );
  lastElementFromArray.classList.add(nameOfType);
}

function emojiSetting(emoji, pokemonId) {
  let lastElementFromArray = document.getElementById(
    "emoji-pokemon-" + pokemonId
  );
  lastElementFromArray.innerHTML = emoji;
}

function applyPokemonTypes(nameOfFirstType, whichPokemonId, pokemonId) {
  const type_mapping = {
    grass: { color: "background-grass-type", emoji: "🌿" },
    water: { color: "background-water-type", emoji: "💧" },
    fire: { color: "background-fire-type", emoji: "🔥" },
    normal: { color: "background-normal-type", emoji: "⭐" },
    poison: { color: "background-poison-type", emoji: "☠️" },
    flying: { color: "background-flying-type", emoji: "🪶" },
    bug: { color: "background-bug-type", emoji: "🐞" },
    fairy: { color: "background-fairy-type", emoji: "🧚‍♀️" },
    psychic: { color: "background-psychic-type", emoji: "👁️‍🗨️" },
    electric: { color: "background-electric-type", emoji: "⚡" },
    ground: { color: "background-ground-type", emoji: "🗿" },
    fighting: { color: "background-fighting-type", emoji: "🥊" },
    dragon: { color: "background-dragon-type", emoji: "🐉" },
    rock: { color: "background-rock-type", emoji: "🪨" },
    ice: { color: "background-ice-type", emoji: "❄️" },
    ghost: { color: "background-ghost-type", emoji: "👻" },
    steel: { color: "background-steel-type", emoji: "🛡️" },
    dark: { color: "background-dark-type", emoji: "🌙" },
  };

  applyTheBackgroundColor(
    type_mapping[nameOfFirstType].color,
    whichPokemonId,
    pokemonId
  );
  emojiSetting(type_mapping[nameOfFirstType].emoji, pokemonId);
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
