import {getAllListingsByProfile, getProfileForName, updateEntryMedia} from "../js/profile-api.js";
import {isAuthenticated} from "../js/authentication.js";
import {deleteListing, getListingById} from "../js/listings-api.js";

if(!isAuthenticated()) {
    window.location = "/"
}


const nameOfUser = localStorage.getItem("name");

function loadAndRenderProfileInformation() {
    getProfileForName(nameOfUser, false).then(profile => {
        const placeholderUserDetails = document.querySelector("#detailsAboutUserPlaceholder");
        placeholderUserDetails.innerHTML = `
        <div class="d-flex justify-content-start my-5">
         <div class="col-3">
             <div class="row">
                <img
                src="${profile.avatar}"
                alt="profile picture"
                class="img-fluid rounded-circle rounded w-100 h-100 feed-avatar-img object-fit-cover"
                />
             </div>
             <div class="row">
                <button class="btn" id="editProfilePicture">Edit profile picture</button>
             </div>
         </div>
         <div class="align-self-center ms-5 col-8">
            <h2 class="fw-bold mb-0">${profile.name}</h2>
            <p class="my-0">Credits: ${profile.credits}</p>
            <p class="my-0">Wins: ${profile.wins.length}</p>
            <p class="my-0">Listings: ${profile._count.listings}</p>
         </div>
       </div>`
        ;
        const editProfilePictureBtn = document.querySelector("#editProfilePicture");
        editProfilePictureBtn.addEventListener("click", event => {
            const editProfilePictureDiv = document.querySelector("#editProfilePictureDiv")
            editProfilePictureDiv.classList.remove("d-none");
        })

    })
}

loadAndRenderProfileInformation();


const changeProfilePictureBtn = document.querySelector("#changeProfilePicture");
changeProfilePictureBtn.addEventListener("click", event => {
    const inputFieldEditProfileImage = document.querySelector("#profilePicture");
    console.log(inputFieldEditProfileImage.value);
    updateEntryMedia(nameOfUser, inputFieldEditProfileImage.value).then(sucessfulUpdate => {
        if(sucessfulUpdate) {
            loadAndRenderProfileInformation()
            const editProfilePictureDiv = document.querySelector("#editProfilePictureDiv");
            editProfilePictureDiv.classList.add("d-none");
        } else {
            alert("Could not update your profile picture")
        }
    })

})
function renderListings(listings) {
    const placeholderProfileListings = document.querySelector("#placeholderProfileListings");
    const listOfHtmlListings = listings.map(listingByUser => {
        const sortedBids = listingByUser.bids.sort((bid1, bid2) => new Date(bid2.created) - new Date(bid1.created));
        let currentBid = 0;
        if(sortedBids.length > 0) {
            currentBid = sortedBids[0].amount
        }
        return ` <div
            class="col-12 col-md-4 mx-3"
          >
          <div class="row d-flex mb-5 mt-3">
          <a href="" class="text-decoration-none link-dark">
            <div class="rounded-2 shadow pink-background">
              <img
                src="${listingByUser.media}"
                alt="Listing Image"
                class="img-fluid mx-auto rounded-2"
              />
              <h5 class="fw-bold text-center mt-4">${listingByUser.title}</h5>
              <p class="ps-4">
                Current bid: ${currentBid}$
              </p>
              <p class="ps-4">
              Deadline: ${new Date (listingByUser.endsAt).toLocaleDateString()}
              </p>
            <div class="d-flex justify-content-end">
            <button id="editBtn" class="mt-2 me-2 btn px-3 fw-bold" data-postId="${listingByUser.id}">Edit</button>
            <button id="deleteBtn" class="mt-2 btn px-3 fw-bold" data-postId="${listingByUser.id}">Delete</button>
            <div id="deletePostPlaceholder" class="d-none alert alert-danger">Could not delete post, please try again later</div>
            </div>
            </div>
            </a>
            </div>
          </div>
`;
    });
    placeholderProfileListings.innerHTML = listOfHtmlListings.join(" ");

    const deleteBtns = document.querySelectorAll("#deleteBtn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", event => {
            const postId = btn.getAttribute("data-postId");
            deleteListing(postId).then(successfulDeletedListing => {
                if (successfulDeletedListing) {
                    loadAndRenderListings();
                } else {
                    alert("Could not delete listing, please try again later")
                }
            }).catch(error => {
                alert(error);
            });
        })
    })
}

let allListings;
let endedListings;
let activeListings;

function loadAndRenderListings() {
    getAllListingsByProfile(nameOfUser).then(listingsByUser => {

        allListings = listingsByUser;
        endedListings = listingsByUser.filter(listing => {
            return new Date(listing.endsAt) < new Date()
        })
        activeListings = listingsByUser.filter(listing => {
            return new Date(listing.endsAt) >= new Date()
        })
        renderListings(allListings);
    })
}

loadAndRenderListings();

const allListingsBtn = document.querySelector("#allListings");
const activeListingsBtn = document.querySelector("#activeListings");
const endedListingsBtn = document.querySelector("#endedListings");

allListingsBtn.addEventListener("click", event => {
    renderListings(allListings)
});
activeListingsBtn.addEventListener("click", event => {
    renderListings(activeListings)
});
endedListingsBtn.addEventListener("click", event => {
    renderListings(endedListings)
});

//