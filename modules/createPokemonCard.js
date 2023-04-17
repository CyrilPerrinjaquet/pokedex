import * as pokemonCardStyle from "./stylePokemonCard.js";

export function createPokemonCard(
  pokemonListElement,
  pokemonDetails,
  pokemonName,
  pokemonImage
) {
  // ! Creating elements and attributes

  // 1. Pokemon card container
  const pokedexCardContainer = document.createElement("div");

  pokedexCardContainer.setAttribute("class", "pokedex-card-container");
  pokedexCardContainer.setAttribute("id", `${pokemonDetails.id}`);

  // 2. Pokemon link to the details
  const pokedexLinkToDetails = document.createElement("a");

  pokedexLinkToDetails.setAttribute(
    "href",
    `pokemon_details?pokemon=${pokemonName}`
  );

  // 3. Pokemon card info
  const pokedexCardInfo = document.createElement("div");

  pokedexCardInfo.setAttribute("class", "pokedex-card-info");

  // 4. Div for id of pokemon
  const pokedexIdDivOfPokemon = document.createElement("div");

  // 5. Paragraph containing id of pokemon
  const IdOfPokemonParagraph = document.createElement("p");
  const idOfPokemon = document.createTextNode(`N°${pokemonDetails.id}`);

  // 6. Paragraph containing name of pokemon
  const pokemonParagraphName = document.createElement("p");
  const nameOfPokemon = document.createTextNode(`${pokemonName}`);

  // 7. Image of pokemon
  const imageOfPokemon = document.createElement("img");

  imageOfPokemon.setAttribute("src", `${pokemonImage}`);
  imageOfPokemon.setAttribute("alt", `pokemon image of ${pokemonName}`);

  // 8. Pokemon card type(s) container
  const pokedexMainTypeContainer = document.createElement("div");

  // 9. Paragraph containing icon related to type name of pokemon
  const pokedexTypeIconParagraph = document.createElement("p");

  pokedexTypeIconParagraph.setAttribute("class", "pokedex-type-icon");
  pokedexTypeIconParagraph.setAttribute(
    "id",
    `emoji-pokemon-${pokemonDetails.id}`
  );

  // 10. Pokemon card word of first type container
  const pokedexWordTypeContainer = document.createElement("div");

  pokedexWordTypeContainer.setAttribute("class", "pokedex-type-word-container");
  pokedexWordTypeContainer.setAttribute(
    "id",
    `pokemon-type-${pokemonDetails.id}`
  );

  // 11. Paragraph containing the name of the first type
  const pokedexFirstTypeParagraph = document.createElement("p");

  // 12. Name of the first type
  const nameOfFirstType = document.createTextNode(
    `${pokemonDetails.types[0].type.name}`
  );

  // ! Append Childs

  // Div of the first type
  pokedexFirstTypeParagraph.appendChild(nameOfFirstType);
  pokedexWordTypeContainer.appendChild(pokedexFirstTypeParagraph);

  // Append div of the first type and the second type if exists
  appendChildToParent(pokedexMainTypeContainer, [
    pokedexTypeIconParagraph,
    pokedexWordTypeContainer,
    returnTheContainersSecondType(pokemonDetails),
  ]);

  // Pokemon div of the id (N°)
  pokemonParagraphName.appendChild(nameOfPokemon);
  IdOfPokemonParagraph.appendChild(idOfPokemon);
  pokedexIdDivOfPokemon.appendChild(IdOfPokemonParagraph);

  // Append childs to the Pokemon Card info div
  appendChildToParent(pokedexCardInfo, [
    pokedexIdDivOfPokemon,
    pokemonParagraphName,
    imageOfPokemon,
    pokedexMainTypeContainer,
  ]);
  pokedexLinkToDetails.appendChild(pokedexCardInfo);
  pokedexCardContainer.appendChild(pokedexLinkToDetails);
  pokemonListElement.appendChild(pokedexCardContainer);

  // Applying styles for the container of the types
  pokemonCardStyle.applySecondPokemonTypeIfExists(pokemonDetails);
  pokemonCardStyle.applyPokemonTypes(
    pokemonDetails.types[0].type.name,
    "pokemon-type-",
    pokemonDetails.id
  );
}

function returnTheContainersSecondType(result) {
  if (result.types[1] === undefined) {
    return document.createTextNode("");
  } else {
    const pokedexWordTypeContainer = document.createElement("div");
    const pokedexFirstTypeParagraph = document.createElement("p");
    const textOfFirstType = document.createTextNode(
      `${result.types[1].type.name}`
    );
    pokedexWordTypeContainer.setAttribute(
      "id",
      `second-pokemon-type-${result.id}`
    );
    pokedexWordTypeContainer.setAttribute(
      "class",
      "pokedex-type-word-container"
    );
    pokedexFirstTypeParagraph.appendChild(textOfFirstType);
    pokedexWordTypeContainer.appendChild(pokedexFirstTypeParagraph);
    return pokedexWordTypeContainer;
  }
}

function appendChildToParent(parent, child) {
  for (let index = 0; index < child.length; index++) {
    parent.appendChild(child[index]);
  }
}


/*****************************************************************************************/
/*****************************************************************************************/
/*****************************************************************************************/
/*****************************************************************************************/
/*****************************************************************************************/
/*****************************************************************************************/

export function createDetailsPokemonCard(
  pokemonListElement,
  pokemonDetails,
  pokemonName,
  pokemonAnimatedSprite,
  pokedexEntry
) {
  const pokedexDetailsIdOfPokemon = document.createElement("div");
  pokedexDetailsIdOfPokemon.setAttribute(
    "class",
    "pokedex-details-id-of-pokemon"
  );

  const IdOfPokemonParagraph = document.createElement("p");
  const idOfPokemon = document.createTextNode(`N°${pokemonDetails.id}`);

  const pokedexAnimatedSpriteContainer = document.createElement("div");
  const containerOfAnimatedSprite = document.createElement("img");

  containerOfAnimatedSprite.setAttribute("src", `${pokemonAnimatedSprite}`);
  containerOfAnimatedSprite.setAttribute(
    "alt",
    `Animated image of ${pokemonName}`
  );

  const pokedexDetailsInformationContainer = document.createElement("div");
  pokedexDetailsInformationContainer.setAttribute(
    "class",
    "pokedex-details-information-container"
  );

  const nameAndTypesContainer = document.createElement("div");
  const nameOfPokemonParagraph = document.createElement("p");
  const nameOfPokemon = document.createTextNode(`${pokemonName}`);

  const pokedexTypeIconParagraph = document.createElement("p");
  pokedexTypeIconParagraph.setAttribute("class", "pokedex-type-icon");
  pokedexTypeIconParagraph.setAttribute(
    "id",
    `emoji-pokemon-${pokemonDetails.id}`
  );

  const pokedexWordTypeContainer = document.createElement("div");
  pokedexWordTypeContainer.setAttribute("class", "pokedex-type-word-container");
  pokedexWordTypeContainer.setAttribute(
    "id",
    `pokemon-type-${pokemonDetails.id}`
  );
  const pokedexFirstTypeParagraph = document.createElement("p");
  const nameOfFirstType = document.createTextNode(
    `${pokemonDetails.types[0].type.name}`
  );

  const pokedexDescriptionContainer = document.createElement("div");
  const pokedexDescriptionParagraph = document.createElement("p");

  const descriptionOfPokemon = document.createTextNode(`${pokedexEntry}`);

  pokedexDescriptionParagraph.appendChild(descriptionOfPokemon);
  pokedexDescriptionContainer.appendChild(pokedexDescriptionParagraph);
  pokedexFirstTypeParagraph.appendChild(nameOfFirstType);
  pokedexWordTypeContainer.appendChild(pokedexFirstTypeParagraph);

  nameOfPokemonParagraph.appendChild(nameOfPokemon);
  nameAndTypesContainer.appendChild(nameOfPokemonParagraph);
  nameAndTypesContainer.appendChild(pokedexTypeIconParagraph);
  nameAndTypesContainer.appendChild(pokedexWordTypeContainer);

  pokedexDetailsInformationContainer.appendChild(nameAndTypesContainer);
  pokedexDetailsInformationContainer.appendChild(pokedexDescriptionContainer);

  pokedexAnimatedSpriteContainer.appendChild(containerOfAnimatedSprite);
  IdOfPokemonParagraph.appendChild(idOfPokemon);
  pokedexDetailsIdOfPokemon.appendChild(IdOfPokemonParagraph);

  pokemonListElement.appendChild(pokedexDetailsIdOfPokemon);
  pokemonListElement.appendChild(pokedexAnimatedSpriteContainer);
  pokemonListElement.appendChild(pokedexDetailsInformationContainer);

  pokemonCardStyle.applySecondPokemonTypeIfExists(pokemonDetails);
  pokemonCardStyle.applyPokemonTypes(
    pokemonDetails.types[0].type.name,
    "pokemon-type-",
    pokemonDetails.id
  );
}
