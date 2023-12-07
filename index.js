import {headerForLoggedInOrLoggedOutUser, overlayClickingOnSellForNotLoggedInUser} from "./src/js/authentication.js";
import {getAllListings} from "./src/js/listings-api.js";
import {getSortedBids} from "./src/js/listingUtilities.js";


headerForLoggedInOrLoggedOutUser()

overlayClickingOnSellForNotLoggedInUser()

let allListingsFromServer;


const searchInput = document.querySelector("#searchInput");

searchInput.onkeyup = function (event) {
    const searchQuery = searchInput.value
    if(searchQuery && searchQuery !== "" && searchQuery !== " " ) {
        const filteredListings = allListingsFromServer.filter(listingFromServer => {
            const jsonForListing = JSON.stringify(listingFromServer).toLowerCase();
            const index = jsonForListing.indexOf(searchQuery.toLowerCase());
            if(index === -1) {
                return false
            }
            return true;
        });
        insertListingAsHtml(filteredListings);
    } else {
        insertListingAsHtml(allListingsFromServer);
    }
}
const tagInput = document.querySelector("#tagInput");
tagInput.onkeyup = function (event) {
    const tagQuery = tagInput.value
    if (tagQuery && tagQuery !== "" && tagQuery!== " ") {
        fetchListingFromServer(true, tagQuery)
    }else {
        fetchListingFromServer(true, null);
    }
}

function fetchListingFromServer(active, tag) {

    getAllListings(tag, active).then(listings => {
        allListingsFromServer = listings
        const noListingPlaceholder = document.querySelector("#noListingPlaceholder");
        if (listings.length === 0) {
            noListingPlaceholder.classList.remove("d-none");
            insertListingAsHtml([])
        } else {
            insertListingAsHtml(listings);
            noListingPlaceholder.classList.add("d-none");
        }
    })
}

fetchListingFromServer(true, null)
function createImgForListingMedia(media) {
    if(media && media.length > 0) {
        return `<img
                src="${media[0]}"
                alt="listing image"
                class="img-fluid rounded-2 object-fit-cover"
              />`
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
  <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5z"/>
</svg>`;
    }
}

function insertListingAsHtml(listingToShow) {
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
            <h4 class="fw-bolder text-center mt-2">${listing.title}</h4>
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
    const placeholderListings = document.querySelector("#placeholderListings");
    placeholderListings.innerHTML = listingHtml
}

