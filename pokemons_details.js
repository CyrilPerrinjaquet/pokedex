import { createDetailsPokemonCard } from "./modules/createPokemonCards.js";
import * as pokeAPI from "./modules/pokeAPI.js";

const pokedexDetailsElement = document.getElementById("pokedex-card-details");

const searchParams = new URL(document.location).searchParams;
const pokemon = searchParams.get("pokemon");

let currentPokemon = [];

function createPokemonCard() {
  pokeAPI
    .getPokemonSpecies(pokemon)
    .then((resultJSON) => retrievePokedexEntry(resultJSON));
}

async function retrievePokedexEntry(JSONResponse) {
  const pokemonDetails = await pokeAPI.getPokemon(pokemon);
  currentPokemon.push(pokemonDetails);
  createPokemonCards(returnPokemonEntry(JSONResponse));
}

function createPokemonCards(pokedexEntryFromJSONResponse) {
  currentPokemon.forEach((pokemon) =>
    createDetailsPokemonCard(
      pokedexDetailsElement,
      pokemon,
      pokemon.name,
      pokemon["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ],
      pokemon["sprites"]["versions"]["generation-v"]["black-white"][
        "front_default"
      ],
      pokedexEntryFromJSONResponse
    )
  );
}

function returnPokemonEntry(JSONResponse) {
  const foundRightLanguage = JSONResponse.flavor_text_entries.find(
    (element) => element.language.name === "en"
  );

  let pokedexEntry = foundRightLanguage.flavor_text;

  return pokedexEntry
    .replace(pokedexEntry[pokedexEntry.indexOf("\f")], " ")
    .toLowerCase();
}

createPokemonCard();
