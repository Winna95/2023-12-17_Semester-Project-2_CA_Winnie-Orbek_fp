const baseUrl = 'https://api.noroff.dev/api/v1';

/**
 * Retrieves the user profile for the given name.
 *
 * @param {string} name - The name of the user.
 * @param {boolean} includeListings - Whether to include listings in the profile.
 * @returns {object|null} The user profile or null if not found.
 */
export async function getProfileForName(name, includeListings) {
  // Construct the URL for the API endpoint
  let url = baseUrl + `/auction/profiles/${name}`;

  // Include listings information in the URL if specified
  if (includeListings) {
    url += `?_listings=true`;
  }

  // Retrieve the JWT token from local storage
  const jwt = localStorage.getItem('jwt');

  // Set up the headers for the GET request
  const fetchOptions = {
    headers: { Authorization: 'Bearer ' + jwt },
  };

  // Fetch data from the API
  const response = await fetch(url, fetchOptions);

  // Parse the JSON response
  const data = await response.json();

  // Check for errors in the response and return null if errors are present
  if (data.errors && data.errors.length > 0) {
    return null;
  }

  // Return the profile data
  return data;
}

/**
 * Updates the media (e.g., avatar) associated with a user profile.
 *
 * @param {string} name - The name of the user profile for which the media is to be updated.
 * @param {string} avatar - The URL or data representing the updated media (e.g., avatar).
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating the success of the media update.
 */
export async function updateEntryMedia(name, avatar) {
  // Construct the URL for the API endpoint
  let url = baseUrl + `/auction/profiles/${name}/media`;

  // Retrieve the JWT token from local storage
  const jwt = localStorage.getItem('jwt');

  // Set up the headers and body for the PUT request
  const fetchOptions = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + jwt,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ avatar: avatar }),
  };

  // Fetch data from the API
  const response = await fetch(url, fetchOptions);

  // Parse the JSON response
  const data = await response.json();

  // Check for errors in the response and return false if errors are present
  if (data.errors && data.errors.length > 0) {
    console.log(data.errors);
    return false;
  }

  // Return true, indicating successful media update
  return true;
}

/**
 * Fetches all listings associated with a specific user profile.
 *
 * @param {string} profileName - The name of the user profile.
 * @returns {Array} An array of listings associated with the profile.
 */
export async function getAllListingsByProfile(profileName) {
  // Construct the URL for the API endpoint
  let url = baseUrl + `/auction/profiles/${profileName}/listings?_bids=true`;
  // Retrieve the JWT token from local storage
  const jwt = localStorage.getItem('jwt');
  // Set up the headers for the fetch request, including the authorization token
  const fetchOptions = {
    headers: { Authorization: 'Bearer ' + jwt },
  };

  // Fetch data from the API
  const response = await fetch(url, fetchOptions);

  // Parse the JSON response
  const listings = await response.json();

  // Check for errors in the response and return an empty array if errors are present
  if (listings.errors && listings.errors.length > 0) {
    return [];
  }
  // Return the array of listings
  return listings;
}
