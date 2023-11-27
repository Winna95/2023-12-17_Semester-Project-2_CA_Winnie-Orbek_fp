const baseUrl = "https://api.noroff.dev/api/v1";

export async function getAllListings (tag, active) {
    let url = baseUrl + `/auction/listings`;
    if (tag || active) {
        url = url + `?`
    }
    if(tag) {
        url = url + `_tag=${tag}`
    }
    if(active) {
        if(tag) {
            url = url + `&`
        }
        url = url + `_active=true`
    }
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

export async function getListingById (id, includeSeller, includeBids) {

    let url = baseUrl + `/auction/listings/${id}`;
    if(includeSeller || includeBids) {
        url = url + `?`
    }
    if (includeSeller) {
        url = url + `_seller=true`;
    }
    if (includeBids) {
        if (includeSeller) {
            url = url + `&`
        }
        url = url + `_bids=true`;
    }
    const jwt = localStorage.getItem("jwt");

    const fetchOptions = {
        headers: {
            Authorization: "Bearer " + jwt
        }
    };

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return null;
    }
    return data;
}

export async function createListing (title, endDate, tags, description, pictureUrl) {

    const url = baseUrl + "/auction/listings";
    const jwt = localStorage.getItem("jwt")
    let requestBody = {
        title: title,
        endsAt: endDate
    }
    if (tags && Array.isArray(tags) ) {
        requestBody.tags = tags;
    }
    if(description) {
        requestBody.description = description
    }
    if (pictureUrl) {
        requestBody.media = pictureUrl;
    }

    const fetchOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + jwt
        },
        body: JSON.stringify(requestBody)
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return false;
    }
    return true;
}

export async function updateListing (id, title, description, tags, pictureUrl) {

    const url = baseUrl + `/auction/listings/${id}`;
    const jwt = localStorage.getItem("jwt");
    let requestBody = {
        title: title,
        body: description
    }
    if (tags && tags === Array.isArray(tags) ) {
        requestBody.tags = tags;
    }
    if (pictureUrl) {
        requestBody.media = pictureUrl;
    }
    const fetchOptions = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + jwt
        },
        body: JSON.stringify(requestBody)
    };

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return false;
    }
    return true;
}

export async function deleteListing (id) {

    const url = baseUrl + `/auction/listings/${id}`;
    const jwt = localStorage.getItem("jwt");

    const fetchOptions = {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + jwt
        }
    };

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return false;
    }
    return true;
}

export async function bidOnListing(listingId, biddingAmount) {
    let url = baseUrl + `/auction/listings/${listingId}/bids`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        method: "PUT",
        headers: {Authorization: "Bearer " + jwt},
        body: JSON.stringify({amount: biddingAmount})
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return false;
    }
    return true;
}