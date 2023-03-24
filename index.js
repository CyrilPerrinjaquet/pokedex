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
const searchElementValue = document.getElementById("search");

/*
 ***********
 *VARIABLES*
 ***********
 */

let nextSetOfPokemons = "";

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

// UTILISER UN MAP PLUS TOT QUE FOREACH CAR IL EST PAS FORCEMENT SYNCRONISE H24

function createNewPokemonCardsFromJSON(pokemonsJSON) {
  nextSetOfPokemons = pokemonsJSON["next"];
  pokemonsJSON["results"].map((element) => {
    getPokemon(element.name).then((result) => {
      createPokemonsCard(
        result,
        getDataOfPokemons(result, "pokemonsName"),
        getDataOfPokemons(result, "staticSprite"),
        returnTheContainersSecondType(result)
      );
    });
  });
}

/*
 *****
 *API*
 *****
 */

async function fetchAPI(URL, options) {
  const response = await fetch(URL, options);
  if (response.ok) {
    return response.json();
  } else {
    alert("ERROR");
  }
}

function getPokemons() {
  return fetchAPI(pokemonURL, { method: "GET" });
}
// TODO Mettre un commentaire qui explique les deux fonctions en dessus et en dessous
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

function searchForAPokemon() {
  pokedexListElement.innerHTML = "";
  getPokemon(searchElementValue.value).then((result) =>
    createPokemonsCard(
      result,
      getDataOfPokemons(result, "pokemonsName"),
      getDataOfPokemons(result, "staticSprite"),
      returnTheContainersSecondType(result)
    )
  );
}

/*
 ********************************
 *SHOW LOAD MORE BUTTON FUNCTION*
 ********************************
 */

function showButtonLoadMore() {
  const currentHeightOfThePage = document.documentElement.scrollHeight;
  const positionOfTheUser = window.scrollY + window.innerHeight;

  if (positionOfTheUser >= currentHeightOfThePage - 1) {
    pokedexLoadMoreButtonElement.style.display = "block";
  } else {
    pokedexLoadMoreButtonElement.style.display = "none";
  }
}

/*
 *************************************
 *CONSTRUCTION OF THE CARDS FUNCTIONS*
 *************************************
 */

function createPokemonsCard(
  JSONResponse,
  pokemonsName,
  imageOfThePokemon,
  secondDivTypes
) {
  pokedexListElement.innerHTML +=
    '<div class="pokedex-card-container"><div class="pokedex-card-info"><div><p>N°' +
    getDataOfPokemons(JSONResponse, "pokemonId") +
    "</p></div><p>" +
    pokemonsName +
    '</p><img src="' +
    imageOfThePokemon +
    '" alt="pokemon-image of ' +
    pokemonsName +
    '" /><div><p class="pokedex-type-icon" id="emoji-pokemon-' +
    getDataOfPokemons(JSONResponse, "pokemonId") +
    '"></p><div class="pokedex-type-word-container" id="pokemon-type-' +
    getDataOfPokemons(JSONResponse, "pokemonId") +
    '"><p>' +
    getDataOfPokemons(JSONResponse, "firstType").type.name +
    "</p></div>" +
    secondDivTypes +
    "</div></div></div>";
  applySecondPokemonTypeIfExists(JSONResponse);
  applyPokemonTypes(
    getDataOfPokemons(JSONResponse, "firstType").type.name,
    "pokemon-type-",
    getDataOfPokemons(JSONResponse, "pokemonId")
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

function applySecondPokemonTypeIfExists(JSONResponse) {
  if (getDataOfPokemons(JSONResponse, "secondType") != undefined) {
    applyPokemonTypes(
      getDataOfPokemons(JSONResponse, "secondType").type.name,
      "second-pokemon-type-",
      getDataOfPokemons(JSONResponse, "pokemonId")
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
searchElementValue.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchForAPokemon();
  }
});
// TODO Voir avec Jérôme comment est-ce que je peux faire pour gérer la hauteur qui change dynamiquement
document.onscroll = showButtonLoadMore;
document.onresize = showButtonLoadMore;
pokedexLoadMoreButtonElement.onclick = loadMorePokemons;

/*
 ***********************
 *MAIN POKEDEX FUNCTION*
 ***********************
 */

getSetOfPokemons();
