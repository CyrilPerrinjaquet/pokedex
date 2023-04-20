/**
 * Fetches the given URL with an fetch method
 * @param {string} URL
 * @param {object} options
 * @returns the response in JSON format of the fetched URL
 */
export async function fetchAPI(URL, options) {
  const response = await fetch(URL, options);
  if (response.ok) {
    return response.json();
  } 
}
