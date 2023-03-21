let next = "";
const initialPokemon = "https://pokeapi.co/api/v2/pokemon/";
const pokedexList = document.getElementById("pokedex-list");

async function pokedex(route, searchInputValue) {
  await fetch(route)
    .then((response) => response.json())
    .then((my_response_in_json_format) => {
      next = my_response_in_json_format["next"];
      my_response_in_json_format["results"].forEach((element) => {
        createNewPokemonCard(element, searchInputValue);
      });
    });
}

function createNewPokemonCard(element, searchInputValue) {
  fetch(element.url)
    .then((response) => response.json())
    .then((my_response_in_json_format) => {
      const data = my_response_in_json_format;
      const pokemonId = data.id;
      const firstType = data.types[0];
      const secondType = data.types[1];
      const nameOfPokemon = element["name"];

      if (!searchInputValue) {
        searchInputValue = " ";
        searchInputValue = "";
      }
      if (!nameOfPokemon.startsWith(searchInputValue)) {
        return;
      }

      const animatedSprite =
        data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
          "front_default"
        ];
      const staticSprite =
        data["sprites"]["versions"]["generation-v"]["black-white"][
          "front_default"
        ];

      const containerOfSecondDiv =
        secondType === undefined
          ? ""
          : returnDivContainerForSecondType(pokemonId, secondType.type.name);

      const applySecondPokemonTypeIfExists = () => {
        if (secondType != undefined) {
          applyPokemonTypes(
            secondType.type.name,
            "second-pokemon-type-",
            pokemonId
          );
        }
      };


      pokedexList.innerHTML +=
        '<div class="pokedex-card-container"><div class="pokedex-card-info"><div><p>N°' +
        pokemonId +
        "</p></div><p>" +
        nameOfPokemon +
        '</p><img src="' +
        staticSprite +
        '" alt="pokemon-image of ' +
        nameOfPokemon +
        '" /><div><p class="pokedex-type-icon" id="emoji-pokemon-' +
        pokemonId +
        '"></p><div class="pokedex-type-word-container" id="pokemon-type-' +
        pokemonId +
        '"><p>' +
        firstType.type.name +
        "</p></div>" +
        containerOfSecondDiv +
        "</div></div></div>";
      applySecondPokemonTypeIfExists();
      applyPokemonTypes(firstType.type.name, "pokemon-type-", pokemonId);
    });
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
    dark: { color: "background-dark-type", emoji: "🌙" }
  };

  applyTheBackgroundColor(
    type_mapping[nameOfFirstType].color,
    whichPokemonId,
    pokemonId
  );
  emojiSetting(type_mapping[nameOfFirstType].emoji, pokemonId);
}

function loadMorePokemons() {
  pokedex(next);
}

function filter() {
  const searchElementValue = document.getElementById("search").value;
  pokedex("https://pokeapi.co/api/v2/pokemon/?limit=151", searchElementValue.toLowerCase());
} 

document.getElementById("search").addEventListener("input", () => {
  pokedexList.innerHTML = "";
  filter();
});

pokedex(initialPokemon);
