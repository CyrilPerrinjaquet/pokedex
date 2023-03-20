let next = "";
const initialPokemon = "https://pokeapi.co/api/v2/pokemon/";

async function fetchEx(route) {
  await fetch(route)
    .then((response) => response.json())
    .then((my_response_in_json_format) => {
      next = my_response_in_json_format["next"];
      my_response_in_json_format["results"].forEach((element) => {
        createNewPokemonCard(element);
      });
    });
}

function createNewPokemonCard(element) {
  const pokedexList = document.getElementById("pokedex-list");

  fetch(element.url)
    .then((response) => response.json())
    .then((my_response_in_json_format) => {
      const data = my_response_in_json_format;
      const pokemonId = data.id;
      const firstType = data.types[0];
      const secondType = data.types[1];

      /*  if (filter_type == 'name'){
        if (filter_value != element["name"]){ // utiliser substring
          return;
        }
      } */

      const animatedSprite =
        data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
          "front_default"
        ];
      const staticSprite =
        data["sprites"]["versions"]["generation-v"]["black-white"][
          "front_default"
        ];

      const displaySecondTypeIfExists = () => {
        if (secondType === undefined) {
          return "";
        } else {
          return returnDivContainerForSecondType(pokemonId, secondType.type.name);
        }
      };

      const temp = secondType === undefined ? "" : returnDivContainerForSecondType(pokemonId, secondType.type.name);

      const applySecondPokemonTypeIfExists = () => {
        if (secondType != undefined) {
          applyPokemonTypes(secondType.type.name, "second-pokemon-type-", pokemonId);
      }
    };
  
      pokedexList.innerHTML +=
        '<div class="pokedex-card-container"><div class="pokedex-card-info"><div><p>N°' +
        pokemonId +
        "</p></div><p>" +
        element["name"] +
        '</p><img src="' +
        staticSprite +
        '" alt="pokemon-image" /><div><p class="pokedex-type-icon" id="emoji-pokemon-' +
        pokemonId +
        '"></p><div class="pokedex-type-word-container" id="pokemon-type-' +
        pokemonId +
        '"><p>' +
        firstType.type.name +
        "</p></div>" +
        temp +
        "</div></div></div>";
      applyPokemonTypes(firstType.type.name, "pokemon-type-", pokemonId);
      applySecondPokemonTypeIfExists();
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
    poison: { color: "background-poison-type", emoji: "🧪" },
    flying: { color: "background-flying-type", emoji: "🪶" },
    bug: { color: "background-bug-type", emoji: "🐞" },
    fairy: { color: "background-fairy-type", emoji: "🧚‍♀️" },
    psychic: { color: "background-psychic-type", emoji: "🧚👁️‍🗨️" },
    electric: { color: "background-electric-type", emoji: "⚡" },
    ground: { color: "background-ground-type", emoji: "🪨" },
    fighting: { color: "background-fighting-type", emoji: "🥊" },
  };
  // TODO type_mapping[nameOfFirstType] === undefined

  applyTheBackgroundColor(
    type_mapping[nameOfFirstType].color,
    whichPokemonId,
    pokemonId
  );
  emojiSetting(type_mapping[nameOfFirstType].emoji, pokemonId);
}

function filter() {
  // todo -> identifier par quoi on filter
  // recuperer tes cards
  //fetchEx("name", "name_value");
}

function loadMorePokemons() {
  fetchEx(next);
}

fetchEx(initialPokemon);
filter();
