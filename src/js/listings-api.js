const baseUrl = 'https://api.noroff.dev/api/v1';

/**
 * Retrieves all listings from the server based on optional filters.
 *
 * @param {string} [tag] - Optional. The tag used to filter listings.
 * @param {boolean} [active] - Optional. Indicates whether to retrieve active listings.
 * @returns {Promise<Array>} A promise that resolves to an array of listings or an empty array if there are errors.
 * @throws {Error} Throws an error if there is an issue with the fetch request or if the response indicates an error.
 */
export async function getAllListings(tag, active) {
  let url = baseUrl + `/auction/listings?_bids=true`;
  if (tag) {
    url = url + `&_tag=${tag}`;
  }
  if (active) {
    url = url + `&_active=true`;
  }
  const jwt = localStorage.getItem('jwt');
  const fetchOptions = {
    headers: { Authorization: 'Bearer ' + jwt },
  };

  const response = await fetch(url, fetchOptions);

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    return [];
  }
  return data;
}

/**
 * Retrieves a listing by its ID with optional details like seller information and bids.
 *
 * @param {string} id - The ID of the listing to retrieve.
 * @param {boolean} [includeSeller=false] - Optional. Indicates whether to include seller information.
 * @param {boolean} [includeBids=false] - Optional. Indicates whether to include bid details.
 * @returns {Promise<Object|null>} A promise that resolves to the listing object or null if there are errors.
 * @throws {Error} Throws an error if there is an issue with the fetch request or if the response indicates an error.
 */
export async function getListingById(id, includeSeller, includeBids) {
  let url = baseUrl + `/auction/listings/${id}`;
  if (includeSeller || includeBids) {
    url = url + `?`;
  }
  if (includeSeller) {
    url = url + `_seller=true`;
  }
  if (includeBids) {
    if (includeSeller) {
      url = url + `&`;
    }
    url = url + `_bids=true`;
  }
  const jwt = localStorage.getItem('jwt');

  const fetchOptions = {
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  };

  const response = await fetch(url, fetchOptions);

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    return null;
  }
  return data;
}

/**
 * Creates a new listing.
 *
 * @param {string} title - The title of the listing.
 * @param {string} endDate - The end date of the listing.
 * @param {string[]} [tags] - Optional. An array of tags associated with the listing.
 * @param {string} [description] - Optional. The description of the listing.
 * @param {string[]} [pictureUrls] - Optional. An array of picture URLs for the listing.
 * @returns {Promise<string[]>} A promise that resolves to an array of error messages (empty if successful).
 * @throws {Error} Throws an error if there is an issue with the fetch request or if the response indicates an error.
 */
export async function createListing(
  title,
  endDate,
  tags,
  description,
  pictureUrls,
) {
  const url = baseUrl + '/auction/listings';
  const jwt = localStorage.getItem('jwt');
  let requestBody = {
    title: title,
    endsAt: endDate,
  };
  if (tags && Array.isArray(tags)) {
    requestBody.tags = tags;
  }
  if (description) {
    requestBody.description = description;
  }
  if (pictureUrls) {
    requestBody.media = pictureUrls;
  }
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + jwt,
    },
    body: JSON.stringify(requestBody),
  };

  const response = await fetch(url, fetchOptions);

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    return data.errors.map(error => error.message);
  }
  return [];
}

/**
 * Deletes a listing.
 *
 * @param {string} id - The ID of the listing to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if the deletion is successful, false otherwise.
 * @throws {Error} Throws an error if there is a network error or if the response indicates an error.
 */
export async function deleteListing(id) {
  const url = baseUrl + `/auction/listings/${id}`;
  console.log(url);
  const jwt = localStorage.getItem('jwt');

  const fetchOptions = {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  };
  const response = await fetch(url, fetchOptions);
  if (response.ok) {
    return true;
  }
  const data = await response.json();
  if (data.errors && data.errors.length > 0) {
    return false;
  }
  return true;
}

/**
 * Places a bid on a listing.
 *
 * @param {string} listingId - The ID of the listing to bid on.
 * @param {number} biddingAmount - The amount to bid on the listing.
 * @returns {Promise<boolean>} A promise that resolves to true if the bid is successful, false otherwise.
 * @throws {Error} Throws an error if there is a network error or if the response indicates an error.
 */
export async function bidOnListing(listingId, biddingAmount) {
  let url = baseUrl + `/auction/listings/${listingId}/bids`;
  const jwt = localStorage.getItem('jwt');
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + jwt,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: biddingAmount }),
  };

  const response = await fetch(url, fetchOptions);

  const data = await response.json();

  if (data.errors && data.errors.length > 0) {
    console.error(data.errors.map(err => err.message));
    return false;
  }
  return true;
}
