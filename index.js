let next = "";
const initialPokemon = "https://pokeapi.co/api/v2/pokemon/?limit=151";
const pokedexList = document.getElementById("pokedex-list");

async function fetchEx(route, nameValue) {
  await fetch(route)
    .then((response) => response.json())
    .then((my_response_in_json_format) => {
      next = my_response_in_json_format["next"];
      my_response_in_json_format["results"].forEach((element) => {
        createNewPokemonCard(element, nameValue);
      });
    });
}

function createNewPokemonCard(element, nameValue) {
  
    fetch(element.url)
      .then((response) => response.json())
      .then((my_response_in_json_format) => {
        const data = my_response_in_json_format;
        const pokemonId = data.id;
        const firstType = data.types[0];
        const secondType = data.types[1];
        const nameOfPokemon = element["name"];

        if (!nameValue) {
          nameValue = " ";
          nameValue = "";
        }
        if (!nameOfPokemon.startsWith(nameValue)) {
          return;
        }
        /*  if (filter_type == 'name'){
        if (filter_value != element["name"]){ // utiliser substring
          return;
        }
      } */

        const animatedSprite =
          data["sprites"]["versions"]["generation-v"]["black-white"][
            "animated"
          ]["front_default"];
        const staticSprite =
          data["sprites"]["versions"]["generation-v"]["black-white"][
            "front_default"
          ];

        const temp =
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
          temp +
          "</div></div></div>";
        applySecondPokemonTypeIfExists();
        /* Ici si j'inverse les deux lignes, cela va inverser l'ordre des émojis, car
         * les deux fonctions vont set les emojis en fonction de leurs noms de types, du coup vu que c'est .innerHTML
         * ca va Override le précedent, c'est pourquoi je le met en premier
         */
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

function loadMorePokemons() {
  fetchEx(next);
}

function filter() {
  const searchElementValue = document.getElementById("search").value;
  fetchEx(initialPokemon, searchElementValue);
}

document.getElementById("search").addEventListener("input", () => {
  pokedexList.innerHTML = "";
  filter();
});

fetchEx(initialPokemon);
