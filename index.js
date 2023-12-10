import {headerForLoggedInOrLoggedOutUser, overlayClickingOnSellForNotLoggedInUser, addClickListenerForLogOut} from "./src/js/authentication.js";
import {getAllListings} from "./src/js/listings-api.js";
import {getSortedBids} from "./src/js/listingUtilities.js";


headerForLoggedInOrLoggedOutUser()

overlayClickingOnSellForNotLoggedInUser()

addClickListenerForLogOut()

let allListingsFromServer;


const searchInput = document.querySelector("#searchInput");

/**
 * Attach an event listener to the search input to filter listings based on user input.
 * Retrieves the search query, filters the listings, and updates the displayed listings accordingly.
 *
 * @param {Event} event - The keyup event triggering the function.
 */
searchInput.onkeyup = function (event) {
    const searchQuery = searchInput.value
    // Check if the search query is not empty or only contains spaces
    if(searchQuery && searchQuery !== "" && searchQuery !== " " ) {
        // Filter listings based on the search query
        const filteredListings = allListingsFromServer.filter(listingFromServer => {
            const jsonForListing = JSON.stringify(listingFromServer).toLowerCase();
            const index = jsonForListing.indexOf(searchQuery.toLowerCase());
            if(index === -1) {
                return false
            }
            return true;
        });
        // Update the displayed listings with the filtered results
        insertListingAsHtml(filteredListings);
    } else {
        // If the search query is empty, show all listings
        insertListingAsHtml(allListingsFromServer);
    }
}

const tagInput = document.querySelector("#tagInput");

/**
 * Attach an event listener to the tag input to fetch listings from the server based on tag input.
 * Retrieves the tag query, fetches listings from the server, and updates the displayed listings accordingly.
 *
 * @param {Event} event - The keyup event triggering the function.
 */

tagInput.onkeyup = function (event) {
    const tagQuery = tagInput.value
    // Check if the tag query is not empty or only contains spaces
    if (tagQuery && tagQuery !== "" && tagQuery!== " ") {
        // Fetch listings from the server based on the tag query
        fetchListingFromServer(true, tagQuery)
    }else {
        // If the tag query is empty, fetch all listings from the server
        fetchListingFromServer(true, null);
    }
}


/**
 * Fetch listings from the server based on specified criteria and update the displayed listings.
 *
 * @param {boolean} active - Indicates whether to fetch active (true) or inactive (false) listings.
 * @param {string|null} tag - Optional tag used to filter listings. Pass null for all listings without a specific tag.
 * @returns {void}
 */
function fetchListingFromServer(active, tag) {
    /**
     * Retrieve listings from the server based on the provided criteria.
     *
     * @param {Array} listings - The array of listings obtained from the server.
     * @returns {void}
     */
    getAllListings(tag, active).then(listings => {
        allListingsFromServer = listings
        const noListingPlaceholder = document.querySelector("#noListingPlaceholder");
        // Check if there are no listings
        if (listings.length === 0) {
            noListingPlaceholder.classList.remove("d-none");
            insertListingAsHtml([])
        } else {
            // Display the fetched listings and hide the "no listings" placeholder
            insertListingAsHtml(listings);
            noListingPlaceholder.classList.add("d-none");
        }
    })
}

fetchListingFromServer(true, null)

/**
 * Create HTML markup for displaying listing media (images).
 *
 * @param {string[]} medias - Array of media URLs associated with the listing.
 * @returns {string} - HTML markup containing an image tag for the first media or a default card image icon.
 */
function createImgForListingMedia(medias) {
    /**
     * Check if media URLs are provided.
     * If available, return an image tag with the first media URL.
     * If not available, return a default card image icon.
     *
     * @param {string[]} medias - Array of media URLs.
     * @returns {string} - HTML markup for listing media.
     */
    if(medias && medias.length > 0) {
            return `<img
                src="${medias[0]}"
                alt="listing image"
                class="img-fluid rounded-2 object-fit-cover feed-img"
              />`
        }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-card-image feed-img" viewBox="0 0 16 16">
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
</svg>`;
}

/**
 * Insert HTML markup for displaying listings into a designated placeholder element.
 *
 * @param {Object[]} listingToShow - Array of listing objects to be displayed.
 * @param {string} listingToShow[].id - Unique identifier for the listing.
 * @param {string} listingToShow[].media - Array of media URLs associated with the listing.
 * @param {string} listingToShow[].title - Title of the listing.
 * @param {string} listingToShow[].endsAt - Deadline of the listing.
 *
 * @returns {void} - The function doesn't return a value, but it updates the HTML content of the placeholder element.
 */
function insertListingAsHtml(listingToShow) {
    /**
     * Map each listing object to its corresponding HTML markup.
     *
     * @param {Object} listing - Listing object.
     * @param {string} listing.id - Unique identifier for the listing.
     * @param {string} listing.media - Array of media URLs associated with the listing.
     * @param {string} listing.title - Title of the listing.
     * @param {string} listing.endsAt - Deadline of the listing.
     *
     * @returns {string} - HTML markup for a single listing.
     */
    const listingHtml =  listingToShow.map(listing => {
        const sortedBids = getSortedBids(listing)
        const amountOfLatestBid = sortedBids.length > 0 ? sortedBids[0].amount: 0
        return `<div class="col-12 col-md-4">
                <div class="row mb-5 mt-3">
                <a href="./src/productDetailPage/detailPage.html?listingId=${listing.id}" class="text-decoration-none link-dark"> <div
            class="rounded-2 mb-5"
          >
          <div class="shadow pink-background pb-3">
            <div class="text-center">
            ${createImgForListingMedia(listing.media)}
            </div>
            <h4 class="fw-bolder text-center mt-2" style="word-break: break-all ;">${listing.title}</h4>
            <p class="ms-2">
               Current bid: ${amountOfLatestBid}
            </p>
            <p class="ms-2">Deadline: ${new Date (listing.endsAt).toLocaleDateString()}</p>
          </div>
          </div>
          </a>
          </div>
          </div>
`
    }).join(" ");
    // Get the placeholder element where listings will be inserted.
    const placeholderListings = document.querySelector("#placeholderListings");
    // Update the HTML content of the placeholder with the generated listing HTML.
    placeholderListings.innerHTML = listingHtml
}

