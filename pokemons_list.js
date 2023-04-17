/* import * as pokeAPI from './pokeAPI.js' */

/* import "nom de la fonction" as quelquechose from './createPokemonCard.js'*/

const searchParams = new URL(document.location).searchParams
const pokemon = searchParams.get("pokemon");

console.log(pokemon);
