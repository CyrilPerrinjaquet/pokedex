import * as pokeAPI from "./modules/pokeAPI.js";


/* import "nom de la fonction" as quelquechose from './createPokemonCard.js'*/

const searchParams = new URL(document.location).searchParams
const pokemon = searchParams.get("pokemon");

console.log(pokemon);
