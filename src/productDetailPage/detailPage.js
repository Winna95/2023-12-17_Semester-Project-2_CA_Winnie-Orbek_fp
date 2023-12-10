import {
    headerForLoggedInOrLoggedOutUser,
    isAuthenticated,
    overlayClickingOnSellForNotLoggedInUser,
    addClickListenerForLogOut
} from "../js/authentication.js";
import {bidOnListing, getListingById} from "../js/listings-api.js";
import {getSortedBids} from "../js/listingUtilities.js";

headerForLoggedInOrLoggedOutUser()
overlayClickingOnSellForNotLoggedInUser()
addClickListenerForLogOut()

const listingId = new URLSearchParams(document.location.search).get("listingId");

/**
 * Fetches a listing by its ID and updates the HTML content with information about the seller.
 *
 * @param {string} listingId - The ID of the listing to fetch.
 * @returns {Promise<void>} - Resolves once the listing is fetched and seller information is updated.
 */
getListingById(listingId, true, true).then(listing => {
    // Select the HTML element where seller details will be displayed
    const detailsAboutSellerPlaceholder = document.querySelector("#detailsAboutSellerPlaceholder");
    // Update the HTML content dynamically with information about the seller
    detailsAboutSellerPlaceholder.innerHTML = `
    <div
            class="col-12 mb-5"
          >
            <div class="d-flex pt-4">
              <img
                src="${listing.seller.avatar}"
                alt="profile picture"
                class="img-fluid rounded-circle feed-avatar-img mw-50 mh-50 col-2 ms-5 object-fit-cover"
              />
              <div class="ms-3 mt-4">
                <b>${listing.seller.name}</b>
              </div>
            </div>
          </div>`;
})

/**
 * Fetches the details of a listing by its ID, renders the listing information dynamically, and sets up event listeners.
 * The rendered information includes the listing title, description, deadline, current bid, bidding history button,
 * make a bid button, and an image of the listing.
 *
 * @async
 * @function
 * @returns {Promise<void>} - Resolves once the listing details are fetched and the rendering is completed.
 */
function fetchAndRenderListing() {
    getListingById(listingId, true, true).then(listing => {
        // Select the placeholder element where the listing details will be rendered.
        const productDetailPlaceholder = document.querySelector("#productDetailPlaceholder");
        // Get sorted bids for the listing.
        const sortedBids = getSortedBids(listing)
        // Determine the amount of the latest bid.
        const amountOfLatestBid = sortedBids.length > 0 ? sortedBids[0].amount : 0
        // Update the HTML content dynamically with information about the listing.
        productDetailPlaceholder.innerHTML = `
    <div
            class="d-flex mt-5 row"
          >
          <div class="col-12 col-md-6">
                <h2 class="mb-2">${listing.title}</h2>
                <p class="mb-2">${listing.description}</p>
                <p class="mb-0">Deadline: ${new Date(listing.endsAt).toLocaleDateString()}</p>
                <P class="mb-0">Current bid: ${amountOfLatestBid}</P>
                <button class="btn ms-0 ps-0 text-decoration-underline mt-0 link-dark" id="seeBiddingHistoryBtn">See bidding history<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/>
</svg></button>
<div id="biddingHistoryPlaceholder" class="mt-0">
</div>
<div>
<button class="btn btn-primary ms-0 ps-2 my-5" id="makeABidBtn">Make a bid</button>
</div>
          </div>
          <div class="col-12 col-md-6">
                <img
                src="${listing.media}"
                alt="listing picture"
                class="img-fluid object-fit-cover"
              />
              </div>
          </div>`;
        // Set up event listeners for the "Make a Bid" button and "See Bidding History" button.
        addOnClickListenerToMakeABidBtns(listing)
        overlayClickingOnSeeBiddingHistory(listing.bids.length);
    })
}

fetchAndRenderListing();

let makeBidDialogVisible = false;
/**
 * Handles overlay clicking on the "See Bidding History" button based on the number of bids.
 *
 * @param {number} bidCount - The count of bids for the listing.
 */
function overlayClickingOnSeeBiddingHistory(bidCount) {
    // Select the "See Bidding History" button
    const  seeBiddingHistoryBtn= document.querySelector('#seeBiddingHistoryBtn');
    // Check if there are no bids, hide the button
    if (bidCount < 1) {
        seeBiddingHistoryBtn.classList.add('d-none')
    }
    // Select the "Make a Bid" button
    const makeABidBtn = document.querySelector("#makeABidBtn")
    if (!isAuthenticated()) {
        // Hide the "Make a Bid" button
        makeABidBtn.classList.add("d-none");
        // Add event listener to show an overlay for not logged-in users when clicking on "See Bidding History"
        seeBiddingHistoryBtn.addEventListener('click', () => {
            const overlaySeeBiddingHistoryNotLoggedIn = document.querySelector("#overlaySeeBiddingHistoryNotLoggedIn")
            overlaySeeBiddingHistoryNotLoggedIn.classList.remove('d-none');
            setTimeout(() => {
                overlaySeeBiddingHistoryNotLoggedIn.classList.add('d-none');
            }, 5500);
        });
    } else {
// Add event listener to show bidding history for logged-in users when clicking on "See Bidding History"
        seeBiddingHistoryBtn.addEventListener('click', () => {
            // Hide the "Make a Bid" button
            makeABidBtn.classList.add("d-none");
            // Fetch the listing details to display the bidding history
            getListingById(listingId, true, true).then(listing => {
                const overLaySeeBiddingHistoryLoggedIn = document.querySelector("#overlaySeeBiddingHistoryLoggedIn");
                overLaySeeBiddingHistoryLoggedIn.classList.remove('d-none');
                // Select the placeholder for bidding history
                const biddingHistoryPlaceholder = document.querySelector("#biddingHistoryPlaceholder");
                biddingHistoryPlaceholder.innerHTML = `<h2 class="mt-2">Bidding History</h2>`;
                // Display the bidding history in reverse order
                biddingHistoryPlaceholder.innerHTML += getSortedBids(listing).reverse().map(bid => {
                    return `<p>${new Date (bid.created).toLocaleDateString()}: ${bid.amount}$</p>`
                }).join(" ");
                // If the "Make a Bid" dialog is not visible, show the "Make a Bid" button
                if(!makeBidDialogVisible) {
                    biddingHistoryPlaceholder.innerHTML += `<button class="btn btn-primary mb-5" id="makeABidBtn">Make a bid</button>`
                }
                // Add click event listeners to "Make a Bid" buttons
                addOnClickListenerToMakeABidBtns(listing)
            })
        })
    }
}


/**
 * Adds click event listeners to "Make a Bid" buttons.
 *
 * @param {object} listing - The listing object containing details about the product.
 */
function addOnClickListenerToMakeABidBtns(listing) {
    // Select all elements with the ID "makeABidBtn"
 const btns = document.querySelectorAll("#makeABidBtn");
    // Iterate over each button and add click event listener
 btns.forEach(btn => {
     btn.addEventListener("click", () => {
         // Check if the user is not authenticated
         if(!isAuthenticated()) {
             // Show overlay for not logged-in users when clicking on "Make a Bid"
            const overlaySeeBiddingBtnNotLoggedIn = document.querySelector("#overlaySeeBiddingBtnNotLoggedIn");
            overlaySeeBiddingBtnNotLoggedIn.classList.remove("d-none");
             setTimeout(() => {
                 overlaySeeBiddingBtnNotLoggedIn.classList.add('d-none');
             }, 5500);
         } else {
             // Select the "Make a Bid" form
             const makeABidForm = document.querySelector("#makeABidForm");
             // Remove the "d-none" class to make the form visible
             makeABidForm.classList.remove("d-none");
             // Set the flag to indicate that the "Make a Bid" dialog is visible
             makeBidDialogVisible = true;
             // Hide all "Make a Bid" buttons
             btns.forEach(btn => btn.classList.add("d-none"));
             // Select the placeholder for the current bid amount
            const placeholderCurrentBid = document.querySelector("#placeholderCurrentBid");
             // Get the sorted bids for the listing
            const sortedBids = getSortedBids(listing);
             // Calculate the current bid amount
            const currentBid = sortedBids.length > 0? sortedBids[0].amount:0;
            const bidInput = document.querySelector("#bidInput")
             // Select the bid input element and set the minimum value
             bidInput.setAttribute("min", `${currentBid + 1}`)
             // Select the bid input element and set the minimum value
            placeholderCurrentBid.innerHTML = "The current bid is: " + currentBid;
             // Add submit event listener to the "Make a Bid" form
            makeABidForm.addEventListener("submit", event => {
                event.preventDefault()
                event.stopPropagation()
                // Check if the form is valid
                if (makeABidForm.checkValidity()) {
                    // Get the new bid amount from the input
                   const newBid = bidInput.value
                    // Place a bid on the listing
                    bidOnListing(listing.id, parseInt(newBid)).then(sucessfullBid => {
                        if(sucessfullBid) {
                            // Hide the "Make a Bid" form
                            makeABidForm.classList.add("d-none");
                            // Fetch and render the updated listing details
                            fetchAndRenderListing();
                        } else {
                            // Show an alert for unsuccessful bid
                            alert(
                                "Unable to place your bid, please check your credits," +
                                " ensure you are not bidding on your own listing and try again later."
                            );
                        }
                    })

                } else {
                    // Add the 'was-validated' class to show validation feedback
                    makeABidForm.classList.add('was-validated')
                }



            })

         }
     })
 })
}
