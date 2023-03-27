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
  getPokemons().then((result) => createNewPokemonCardsFromJSON(result));
}

function loadMorePokemons() {
  getNextSetOfPokemons(nextSetOfPokemons).then((result) =>
    createNewPokemonCardsFromJSON(result)
  );
}

async function createNewPokemonCardsFromJSON(pokemonsJSON) {
  currentPokemons = [];
  nextSetOfPokemons = pokemonsJSON.next;
  for (const pokemon of pokemonsJSON.results) {
    const pokemonDetails = await getPokemon(pokemon.name);
    currentPokemons.push(pokemonDetails);
  }

  createPokemonCards();
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

/**
 * Calls the function fetchAPI() with the pokemonURL constant and with the method "GET"
 * @returns The response in JSON of the pokemonURL
 */
function getPokemons() {
  return fetchAPI(pokemonURL, { method: "GET" });
}
// TODO Mettre un commentaire qui explique les deux fonctions en dessus et en dessous
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

function getDataOfPokemons(response, elementWeAreSearchingFor) {
  const dataMapping = {
    element: response,
    pokemonId: response.id,
    firstType: response.types[0],
    secondType: response.types[1],
    staticSprite:
      response["sprites"]["versions"]["generation-v"]["black-white"][
        "front_default"
      ],
    pokemonsName: response.name,
  };
  return dataMapping[elementWeAreSearchingFor];
}

function returnTheContainersSecondType(result) {
  return getDataOfPokemons(result, "secondType") === undefined
    ? ""
    : returnDivContainerForSecondType(
        getDataOfPokemons(result, "pokemonId"),
        getDataOfPokemons(result, "secondType").type.name
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
  const pokemonDetails = await getPokemon(
    searchElement.value.toLowerCase()
  );
  currentPokemons.push(pokemonDetails);
  createPokemonCards();
}

function createPokemonCards() {
  currentPokemons.forEach((pokemon) =>
    createPokemonsCard(
      pokemon,
      getDataOfPokemons(pokemon, "pokemonsName"),
      getDataOfPokemons(pokemon, "staticSprite"),
      returnTheContainersSecondType(pokemon)
    )
  );
}

/*
 *************************************
 *CONSTRUCTION OF THE CARDS FUNCTIONS*
 *************************************
 */

function createPokemonsCard(
  pokemonDetails,
  pokemonName,
  pokemonImage,
  secondDivTypes
) {
  pokedexListElement.innerHTML +=
    '<div class="pokedex-card-container"><div class="pokedex-card-info"><div><p>N°' +
    getDataOfPokemons(pokemonDetails, "pokemonId") +
    "</p></div><p>" +
    pokemonName +
    '</p><img src="' +
    pokemonImage +
    '" alt="pokemon-image of ' +
    pokemonName +
    '" /><div><p class="pokedex-type-icon" id="emoji-pokemon-' +
    getDataOfPokemons(pokemonDetails, "pokemonId") +
    '"></p><div class="pokedex-type-word-container" id="pokemon-type-' +
    getDataOfPokemons(pokemonDetails, "pokemonId") +
    '"><p>' +
    getDataOfPokemons(pokemonDetails, "firstType").type.name +
    "</p></div>" +
    secondDivTypes +
    "</div></div></div>";
  applySecondPokemonTypeIfExists(pokemonDetails);
  applyPokemonTypes(
    getDataOfPokemons(pokemonDetails, "firstType").type.name,
    "pokemon-type-",
    getDataOfPokemons(pokemonDetails, "pokemonId")
  );
}

function returnDivContainerForSecondType(pokemonId, name) {
  return (
    '<div class="pokedex-type-word-container" id="second-pokemon-type-' +
    pokemonId +
    '"><p>' +
    name +
    "</p></div>"
  );
}

function applySecondPokemonTypeIfExists(pokemonDetails) {
  if (getDataOfPokemons(pokemonDetails, "secondType") != undefined) {
    applyPokemonTypes(
      getDataOfPokemons(pokemonDetails, "secondType").type.name,
      "second-pokemon-type-",
      getDataOfPokemons(pokemonDetails, "pokemonId")
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
