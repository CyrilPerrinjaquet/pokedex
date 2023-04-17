import * as pokemonCardStyle from "./stylePokemonCard.js";

export function constructTheCardWithAllInformation(
  pokemonListElement,
  pokemonDetails,
  pokemonName,
  pokemonImage
) {
  pokemonListElement.innerHTML += `<div class="pokedex-card-container" id="${
    pokemonDetails.id
  }"><a href="pokemon_details?pokemon=${pokemonName}"><div class="pokedex-card-info"><div><p>N°${
    pokemonDetails.id
  }</p></div><p>${pokemonName}</p><img src="${pokemonImage}" alt="pokemon-image of ${pokemonName}"/><div><p class="pokedex-type-icon" id="emoji-pokemon-${
    pokemonDetails.id
  }"></p><div class="pokedex-type-word-container" id="pokemon-type-${
    pokemonDetails.id
  }"><p>${
    pokemonDetails.types[0].type.name
  }</p></div>${returnTheContainersSecondType(
    pokemonDetails
  )}</div></div></div>`;
  pokemonCardStyle.applySecondPokemonTypeIfExists(pokemonDetails);
  pokemonCardStyle.applyPokemonTypes(
    pokemonDetails.types[0].type.name,
    "pokemon-type-",
    pokemonDetails.id
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
