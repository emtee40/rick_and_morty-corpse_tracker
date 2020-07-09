const API_ENDPOINT = 'https://rickandmortyapi.com/api';

const handleResponse = response =>
  new Promise(resolve => resolve(response.text()))
    .catch(err =>
      // eslint-disable-next-line prefer-promise-reject-errors
      Promise.reject({
        type: 'NetworkError',
        status: response.status,
        message: err,
      }),
    )
    .then(responseBody => {
      // Attempt to parse JSON
      try {
        const parsedJSON = JSON.parse(responseBody);
        if (response.ok) return parsedJSON;
        if (response.status >= 500) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            type: 'ServerError',
            status: response.status,
            body: parsedJSON,
          });
        }
        if (response.status <= 501) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            type: 'ApplicationError',
            status: response.status,
            body: parsedJSON,
          });
        }
      } catch (e) {
        // We should never get these unless response is mangled
        // Or API is not properly implemented
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({
          type: 'InvalidJSON',
          status: response.status,
          body: responseBody,
        });
      }
    });

export function getAllLocations(page) {
  const url = `${API_ENDPOINT}/location/?page=${page}`;
  return fetch(url, { method: 'GET' }).then(handleResponse);
}

export function getCharacters(ids) {
  const url = `${API_ENDPOINT}/character/${ids}`;
  return fetch(url, { method: 'GET' }).then(handleResponse);
}

// export function getExngSwapWithPriceService(data) {
//   const url_swap = `${CNF_API_TOTLE.ENDPOINT}/swap`;
//   const url_coins = `${CNF_API_SOLIDEFI.ENDPOINT}/usd/?source=${data.swap.sourceAsset}&destination=${data.swap.destinationAsset}`;

//   return Promise.all([
//     fetch(url_swap, {
//       method: 'POST',
//       headers: { 'content-type': 'application/json' },
//       body: JSON.stringify(data),
//     }).then(handleResponse),
//     fetch(url_coins, { method: 'GET', mode: 'cors' }).then(handleResponse),
//   ]).then(data => {
//     const response = data[0];
//     response.response['price'] = data[1];
//     return response;
//   });
// }
