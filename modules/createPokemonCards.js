/*
 ***********
 *IMPORT*
 ***********
 */

import * as pokemonCardStyle from "./stylePokemonCard.js";
import * as pokeAPI from "./pokeAPI.js";

/*
 *******************************************
 *CREATE POKEMON CARD FUNCTION FOR THE LIST*
 *******************************************
 */

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
    `pokemon_details?pokemon=${pokemonDetails.id}`
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
    returnTheContainersSecondType(pokemonDetails, false),
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

/*
 **************************************************
 *RETURN SECOND TYPE CONTAINER IF EXISTES FUNCTION*
 **************************************************
 */

function returnTheContainersSecondType(
  result,
  detailsView,
  pokedexIconElement
) {
  if (window.innerWidth > 1000 && detailsView) {
    pokedexIconElement.style.padding = "0px 0px 0px 40px";
  }
  if ((window.innerWidth < 1000) & detailsView) {
    pokedexIconElement.style.padding = "0px 0px 0px 50px";
  }
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
    detailsView /* With two types */
      ? (pokedexIconElement.style.padding = "0px 30px 5px 0px")
      : "";
    return pokedexWordTypeContainer;
  }
}

function appendChildToParent(parent, child) {
  for (let index = 0; index < child.length; index++) {
    parent.appendChild(child[index]);
  }
}

export function createDetailsPokemonCard(
  pokedexContainerElement,
  pokemonDetails,
  pokemonName,
  pokemonAnimatedSprite,
  pokemonImage,
  pokemonOfficialArtwork,
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
  const animatedSpriteElement = document.createElement("img");

  animatedSpriteElement.setAttribute(
    "src",
    `${pokemonAnimatedSprite ?? pokemonImage ?? pokemonOfficialArtwork}`
  );

  animatedSpriteElement.setAttribute(
    "alt",
    `Animated image or static image of ${pokemonName}`
  );

  const pokedexDetailsInformationContainer = document.createElement("div");
  pokedexDetailsInformationContainer.setAttribute(
    "class",
    "pokedex-details-information-container"
  );

  const nameAndTypesContainer = document.createElement("div");
  const nameOfPokemonParagraph = document.createElement("p");
  nameOfPokemonParagraph.setAttribute("class", "pokedex-name-paragraph");
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
  appendChildToParent(nameAndTypesContainer, [
    nameOfPokemonParagraph,
    pokedexTypeIconParagraph,
    pokedexWordTypeContainer,
    returnTheContainersSecondType(
      pokemonDetails,
      true,
      pokedexTypeIconParagraph
    ),
  ]);

  appendChildToParent(pokedexDetailsInformationContainer, [
    nameAndTypesContainer,
    pokedexDescriptionContainer,
  ]);

  pokedexAnimatedSpriteContainer.appendChild(animatedSpriteElement);
  IdOfPokemonParagraph.appendChild(idOfPokemon);
  pokedexDetailsIdOfPokemon.appendChild(IdOfPokemonParagraph);

  appendChildToParent(pokedexContainerElement, [
    pokedexDetailsIdOfPokemon,
    pokedexAnimatedSpriteContainer,
    pokedexDetailsInformationContainer,
  ]);

  pokemonCardStyle.applySecondPokemonTypeIfExists(pokemonDetails);
  pokemonCardStyle.applyPokemonTypes(
    pokemonDetails.types[0].type.name,
    "pokemon-type-",
    pokemonDetails.id
  );
}

export function createStatsCard(pokedexContainerElement, pokemonDetails) {
  const maxStat = 255;

  const pokedexStatsMainContainer = document.createElement("div");
  pokedexStatsMainContainer.setAttribute(
    "class",
    "pokedex-stats-main-container"
  );

  pokemonDetails.stats.forEach((stat) => {
    const pokedexStatsRowContainer = document.createElement("div");

    const pokemonNameOfStatContainer = document.createElement("div");
    const pokemonStatNameParagraphElement = document.createElement("p");
    pokemonStatNameParagraphElement.setAttribute("class", "pokedex-stat-name");
    const nameOfPokemonStatElement = document.createTextNode(
      `${stat.stat.name}`
    );

    const pokemonProgessBarContainer = document.createElement("div");
    pokemonProgessBarContainer.setAttribute(
      "class",
      "pokedex-progress-bar-container"
    );

    const pokemonProgessBarDiv = document.createElement("div");
    pokemonProgessBarDiv.setAttribute("class", "pokedex-progress-bar");
    const pokemonNumberOfStatContainer = document.createElement("div");
    const pokemonNumberOfStatParapgraphElement = document.createElement("p");
    const numberOfStat = document.createTextNode(`${stat.base_stat}`);

    pokemonNumberOfStatParapgraphElement.appendChild(numberOfStat);
    pokemonNumberOfStatContainer.appendChild(
      pokemonNumberOfStatParapgraphElement
    );

    pokemonProgessBarContainer.appendChild(pokemonProgessBarDiv);

    pokemonStatNameParagraphElement.appendChild(nameOfPokemonStatElement);
    pokemonNameOfStatContainer.appendChild(pokemonStatNameParagraphElement);

    appendChildToParent(pokedexStatsRowContainer, [
      pokemonNameOfStatContainer,
      pokemonProgessBarContainer,
      pokemonNumberOfStatContainer,
    ]);

    pokedexStatsMainContainer.appendChild(pokedexStatsRowContainer);

    pokedexContainerElement.appendChild(pokedexStatsMainContainer);

    pokemonProgessBarDiv.style.width = `${stat.base_stat / (maxStat / 100)}%`;
    updateProgressBar(pokemonProgessBarDiv, stat.base_stat / (maxStat / 100));
  });
}

function updateProgressBar(progessBar, percentage) {
  progessBar.style.width = `0%`;
  progessBar.animate(
    { width: `${percentage}%` },
    { duration: 500, fill: "forwards" }
  );
}

export function createEvolutionsCard(pokedexContainerElement, ...image) {
  for (let index = 0; index < 3; index++) {
    const pokedexEvolutionContainer = document.createElement("div");
    const pokemonImageElement = document.createElement("img");
    pokemonImageElement.setAttribute("src", `${image}`);
  pokemonImageElement.setAttribute("alt", `Pokemon image of ${/*image*/"Comming evolution"}`);

    pokedexEvolutionContainer.appendChild(pokemonImageElement);
    pokedexContainerElement.appendChild(pokedexEvolutionContainer);
  }
}
