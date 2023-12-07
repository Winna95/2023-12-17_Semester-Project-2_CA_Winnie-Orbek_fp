import {
    headerForLoggedInOrLoggedOutUser,
    isAuthenticated,
    overlayClickingOnSellForNotLoggedInUser
} from "../js/authentication.js";
import {bidOnListing, getListingById} from "../js/listings-api.js";
import {getSortedBids} from "../js/listingUtilities.js";

headerForLoggedInOrLoggedOutUser()
overlayClickingOnSellForNotLoggedInUser()

const listingId = new URLSearchParams(document.location.search).get("listingId");


getListingById(listingId, true, true).then(listing => {
    const detailsAboutSellerPlaceholder = document.querySelector("#detailsAboutSellerPlaceholder");
    detailsAboutSellerPlaceholder.innerHTML = `
    <div
            class="col-12 mb-5"
          >
            <div class="d-flex pt-4">
              <img
                src="${listing.seller.avatar}"
                alt="profile picture"
                class="img-fluid rounded-circle col-2 ms-5 object-fit-cover feed-avatar-img"
              />
              <div class="ms-3 mt-4">
                <b>${listing.seller.name}</b>
              </div>
            </div>
          </div>`;
})

function fetchAndRenderListing() {
    getListingById(listingId, true, true).then(listing => {
        const productDetailPlaceholder = document.querySelector("#productDetailPlaceholder");
        const sortedBids = getSortedBids(listing)
        const amountOfLatestBid = sortedBids.length > 0 ? sortedBids[0].amount : 0
        productDetailPlaceholder.innerHTML = `
    <div
            class="d-flex mt-5"
          >
          <div class="col-6">
                <h2 class="mb-2">${listing.title}</h2>
                <p class="mb-2">${listing.description}</p>
                <p class="mb-0">Deadline: ${new Date(listing.endsAt).toLocaleDateString()}</p>
                <P class="mb-0">Current bid: ${amountOfLatestBid}</P>
                <button class="btn ms-0 ps-0 text-decoration-underline mt-0" id="seeBiddingHistoryBtn">See bidding history<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/>
</svg></button>
<div id="biddingHistoryPlaceholder" class="mt-0">
</div>
<div>
<button class="btn btn-primary ms-0 ps-2 mt-5" id="makeABidBtn">Make a bid</button>
</div>
          </div>
          <div class="col-6">
                <img
                src="${listing.media}"
                alt="listing picture"
                class="img-fluid object-fit-cover"
              />
              </div>
          </div>`;
        addOnClickListenerToMakeABidBtns(listing)
        overlayClickingOnSeeBiddingHistory(listing.bids.length);
    })
}

fetchAndRenderListing();

function overlayClickingOnSeeBiddingHistory(bidCount) {
    const  seeBiddingHistoryBtn= document.querySelector('#seeBiddingHistoryBtn');
    if (bidCount < 1) {
        seeBiddingHistoryBtn.classList.add('d-none')
    }
    const makeABidBtn = document.querySelector("#makeABidBtn")
    if (!isAuthenticated()) {
        makeABidBtn.classList.add("d-none");
        seeBiddingHistoryBtn.addEventListener('click', () => {
            const overlaySeeBiddingHistoryNotLoggedIn = document.querySelector("#overlaySeeBiddingHistoryNotLoggedIn")
            overlaySeeBiddingHistoryNotLoggedIn.classList.remove('d-none');
            setTimeout(() => {
                overlaySeeBiddingHistoryNotLoggedIn.classList.add('d-none');
            }, 5500);
        });
    } else {

        seeBiddingHistoryBtn.addEventListener('click', () => {
            makeABidBtn.classList.add("d-none");
            getListingById(listingId, true, true).then(listing => {
                const overLaySeeBiddingHistoryLoggedIn = document.querySelector("#overlaySeeBiddingHistoryLoggedIn");
                overLaySeeBiddingHistoryLoggedIn.classList.remove('d-none');
                const biddingHistoryPlaceholder = document.querySelector("#biddingHistoryPlaceholder");
                biddingHistoryPlaceholder.innerHTML = `<h2 class="mt-2">Bidding History</h2>`;
                biddingHistoryPlaceholder.innerHTML += getSortedBids(listing).reverse().map(bid => {
                    return `<p>${new Date (bid.created).toLocaleDateString()}: ${bid.amount}$</p>`
                }).join(" ");
                biddingHistoryPlaceholder.innerHTML += `<button class="btn btn-primary" id="makeABidBtn">Make a bid</button>`
                addOnClickListenerToMakeABidBtns(listing)
            })
        })
    }
}


function addOnClickListenerToMakeABidBtns(listing) {
 const btns = document.querySelectorAll("#makeABidBtn");
 btns.forEach(btn => {
     btn.addEventListener("click", () => {
         if(!isAuthenticated()) {
            const overlaySeeBiddingBtnNotLoggedIn = document.querySelector("#overlaySeeBiddingBtnNotLoggedIn");
            overlaySeeBiddingBtnNotLoggedIn.classList.remove("d-none");
             setTimeout(() => {
                 overlaySeeBiddingBtnNotLoggedIn.classList.add('d-none');
             }, 5500);
         } else {
             const makeABidForm = document.querySelector("#makeABidForm");
             makeABidForm.classList.remove("d-none");
            const placeholderCurrentBid = document.querySelector("#placeholderCurrentBid");
            const sortedBids = getSortedBids(listing);
            const currentBid = sortedBids.length > 0? sortedBids[0].amount:0;
            const bidInput = document.querySelector("#bidInput")
             bidInput.setAttribute("min", `${currentBid + 1}`)
            placeholderCurrentBid.innerHTML = "The current bid is: " + currentBid;
            makeABidForm.addEventListener("submit", event => {
                event.preventDefault()
                event.stopPropagation()
                if (makeABidForm.checkValidity()) {
                   const newBid = bidInput.value
                    bidOnListing(listing.id, parseInt(newBid)).then(sucessfullBid => {
                        if(sucessfullBid) {
                            makeABidForm.classList.add("d-none");
                            fetchAndRenderListing();
                        } else {
                            alert("Unable to place your bid, please check your credits and try again later.")
                        }
                    })

                } else {
                    makeABidForm.classList.add('was-validated')
                }



            })

         }
     })
 })
}
