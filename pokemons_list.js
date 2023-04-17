import { createDetailsPokemonCard } from "./modules/createPokemonCard.js";
import * as pokeAPI from "./modules/pokeAPI.js";

const pokedexDetailsElement = document.getElementById("pokedex-card-details");

const searchParams = new URL(document.location).searchParams;
const pokemon = searchParams.get("pokemon");

function createPokemonCard() {
  pokeAPI
    .getPokemon(pokemon)
    .then((resultJSON) =>
      createDetailsPokemonCard(
        pokedexDetailsElement,
        resultJSON,
        resultJSON.name,
        resultJSON["sprites"]["versions"]["generation-v"]["black-white"][
          "animated"
        ]["front_default"],
        retrievePokedexEntry()
      )
    );
}

function retrievePokedexEntry() {
  pokeAPI
    .getPokemonSpecies(pokemon)
    .then((resultJSON) => returnPokemonEntry(resultJSON));
}

function returnPokemonEntry(JSON) {
  return JSON.flavor_text_entries[0].flavor_text;
}

createPokemonCard();
