import { fetchAPI } from "./fetchUtils.js";

const POKE_API_BASE_URL = "https://pokeapi.co/api";
const VERSION = "v2";

/**
 * Calls the function fetchAPI() with the pokemonURL constant and with the method "GET"
 * @returns The response in JSON of the pokemonURL
 */
export function getPokemons() {
  return fetchAPI(`${POKE_API_BASE_URL}/${VERSION}/pokemon`, { method: "GET" });
}

/**
 * Calls the function fetchAPI() with the nextURL parameter and with the method "GET"
 * The nextURL parameter refers to the url given by the api pointing to the next of comming pokemons
 * @returns The response in JSON of the nextURL
 */
export function getNextSetOfPokemons(nextURL) {
  return fetchAPI(nextURL, { method: "GET" });
}

export function getPokemon(nameOrIdOfPokemon) {
  return fetchAPI(
    `${POKE_API_BASE_URL}/${VERSION}/pokemon/${nameOrIdOfPokemon}`,
    { method: "GET" }
  );
}

export function getPokemonSpecies(nameOfPokemon) {
  return fetchAPI(
    `${POKE_API_BASE_URL}/${VERSION}/pokemon-species/${nameOfPokemon}`,
    { method: "GET" }
  );
}

export function getAbilities(nameOfPokemon) {
  return fetchAPI(`${POKE_API_BASE_URL}/${VERSION}/ability/${nameOfPokemon}`, {
    method: "GET",
  });
}
export function getCharacteristic(nameOfPokemon) {
  return fetchAPI(
    `${POKE_API_BASE_URL}/${VERSION}/characteristic/${nameOfPokemon}`,
    { method: "GET" }
  );
}
