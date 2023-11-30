const baseUrl = "https://api.noroff.dev/api/v1";

/**
 * Retrieves a user's profile information by their name.
 *
 * @param {string} name - The name of the user whose profile to retrieve.
 * @param {boolean} includeListings - Whether to include the user's listings in the profile (optional).
 * @returns {Promise<Object|Array>} The user's profile object if retrieval is successful; otherwise, an empty array.
 */
export async function getProfileForName (name, includeListings) {
    let url = baseUrl + `/auction/profiles/${name}`;
    if(includeListings) {
        url = url + `?_listings=true`;
    }
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return null;
    }
    return data;
}

export async function getAllProfiles () {
    let url = baseUrl + `/auction/profiles`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return [];
    }
    return data;
}

export async function updateEntryMedia(name, avatar) {
    let url = baseUrl + `/auction/profiles/${name}/media`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        method: "PUT",
        headers: {
            Authorization: "Bearer " + jwt,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({avatar: avatar})
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        console.log(data.errors);
        return false;
    }
    return true;
}

export async function getAllListingsByProfile (profileName) {
    let url = baseUrl + `/auction/profiles/${profileName}/listings?_bids=true`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const listings = await response.json();

    if(listings.errors && listings.errors.length > 0) {
        return [];
    }
    return listings;
}

export async function getAllBidsByProfile (profileName, includeListings) {
    let url = baseUrl + `/auction/profiles/${profileName}/bids`;
    if(includeListings) {
        url = url + `?_listings=true`;
    }
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const bids = await response.json();

    if(bids.errors && bids.errors.length > 0) {
        return [];
    }
    return bids;
}