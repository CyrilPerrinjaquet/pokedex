url_to_fetch = "https://pokeapi.co/api/v2/pokemon/";

async function fetchEx() {
  await fetch(url_to_fetch)
    .then((response) => response.json())
    .then((my_response_in_json_format) => {
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
      const pokemonName = element["name"];
      const id = data.id;
      const firstType = data.types[0];
      let secondType = data.types[1];
      const animatedSprite =
        data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
          "front_default"
        ];
      const staticSprite =
        data["sprites"]["versions"]["generation-v"]["black-white"][
          "front_default"
        ];

      const doesTheSecondTypeExists = () => {
        if (secondType) {
          return (
            '<div class="pokedex-second-type-word-container"><p>' +
            secondType.type.name +
            "</p></div>"
          );
        } else {
          return "";
        }
      };

      pokedexList.innerHTML +=
        '<div class="pokedex-card-container"><div class="pokedex-card-info"><div><p>N°' +
        id +
        "</p></div><p>" +
        pokemonName +
        '</p><img src="' +
        staticSprite +
        '" alt="pokemon-image" /><div><p class="pokedex-type-icon" >🌿</p><div class="pokedex-type-word-container"><p>' +
        firstType.type.name +
        "</p></div>" +
        doesTheSecondTypeExists() +
        "</div></div></div>";
    });
}

function whatColorIsTheType(firstType, secondType) {
  if (firstType === "grass") {
    alert("nice");
  }
}

// TODO Faire une fonction pour les émojis en fonction du type */ 
// TODO Faire une condition que si un pokémon spécifique est trop grand => On le réduit 

fetchEx();