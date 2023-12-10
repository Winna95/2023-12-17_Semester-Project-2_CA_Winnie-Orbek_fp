import {getAllListingsByProfile, getProfileForName, updateEntryMedia} from "../js/profile-api.js";
import {isAuthenticated, addClickListenerForLogOut} from "../js/authentication.js";
import {deleteListing} from "../js/listings-api.js";
import {getSortedBids} from "../js/listingUtilities.js";

addClickListenerForLogOut()
if(!isAuthenticated()) {
    window.location = "/"
}


const nameOfUser = localStorage.getItem("name");

/**
 * Loads and renders profile information for a user.
 */
function loadAndRenderProfileInformation() {
    // Get the profile information for the specified user
    getProfileForName(nameOfUser, false).then(profile => {
        // Select the HTML element where user details will be displayed
        const placeholderUserDetails = document.querySelector("#detailsAboutUserPlaceholder");
        // Update the HTML content dynamically with information about the user
        placeholderUserDetails.innerHTML = `
        <div class="d-flex justify-content-start my-5 col-10">
         <div>
             <div class="row">
                <img
                src="${profile.avatar}"
                alt="profile picture"
                class="img-fluid rounded-circle rounded feed-avatar-img object-fit-cover w-100 h-100 mb-5"
                />
             </div>
             <div class="row">
                <button class="btn text-decoration-underline" id="editProfilePicture">Edit image</button>
             </div>
         </div>
         <div class="align-self-center ms-5">
            <h2 class="fw-bold mb-0">${profile.name}</h2>
            <p class="my-0">Credits: ${profile.credits}</p>
            <p class="my-0">Wins: ${profile.wins.length}</p>
            <p class="my-0">Listings: ${profile._count.listings}</p>
         </div>
       </div>`
        ;
        // Select the "Edit Image" button and add a click event listener
        const editProfilePictureBtn = document.querySelector("#editProfilePicture");
        editProfilePictureBtn.addEventListener("click", event => {
            // Select the HTML element for editing profile picture
            const editProfilePictureDiv = document.querySelector("#editProfilePictureDiv")
            // Remove the "d-none" class to make the editing div visible
            editProfilePictureDiv.classList.remove("d-none");
        })

    })
}

loadAndRenderProfileInformation();


const changeProfilePictureBtn = document.querySelector("#changeProfilePicture");
/**
 * Event listener function for handling the click on the changeProfilePictureBtn.
 *
 * @param {Event} event - The click event.
 */
changeProfilePictureBtn.addEventListener("click", event => {
    // Select the input field for editing the profile image
    const inputFieldEditProfileImage = document.querySelector("#profilePicture");
    // Update the user's profile picture using the entered URL
    updateEntryMedia(nameOfUser, inputFieldEditProfileImage.value).then(sucessfulUpdate => {
        if(sucessfulUpdate) {
            // If the update is successful, reload and render the updated profile information
            loadAndRenderProfileInformation()
            // Select the HTML element for editing profile picture
            const editProfilePictureDiv = document.querySelector("#editProfilePictureDiv");
            // Add the "d-none" class to hide the editing div
            editProfilePictureDiv.classList.add("d-none");
        } else {
            // If the update is not successful, show an alert
            alert("Could not update your profile picture")
        }
    })

})


/**
 * Renders the given list of listings in the profile section.
 *
 * @param {Array} listings - An array of listing objects.
 */
function renderListings(listings) {
    // Select the HTML element where profile listings will be displayed
    const placeholderProfileListings = document.querySelector("#placeholderProfileListings");
    // Generate HTML for each listing and create an array of HTML strings
    const listOfHtmlListings = listings.map(listingByUser => {
        const sortedBids = getSortedBids(listingByUser);
        let currentBid = 0;
        if(sortedBids.length > 0) {
            currentBid = sortedBids[0].amount
        }
        // Return the HTML string for each listing
        return ` <div
            class="col-12 col-md-3"
          >
          <div class="row d-flex mb-5 mt-3">
          <a href="../productDetailPage/detailPage.html?listingId=${listingByUser.id}" class="text-decoration-none link-dark">
            <div class="rounded-2 shadow pink-background">
              <img
                src="${listingByUser.media}"
                alt="Listing Image"
                class="img-fluid mx-auto rounded-2 feed-img object-fit-cover"
              />
              <h5 class="fw-bold text-center mt-4">${listingByUser.title}</h5>
              <p class="ps-4">
                Current bid: ${currentBid}$
              </p>
              <p class="ps-4">
              Deadline: ${new Date (listingByUser.endsAt).toLocaleDateString()}
              </p>
            <div class="d-flex justify-content-end">
            <button id="deleteBtn" class="mt-2 btn px-3 fw-bold" data-listingId="${listingByUser.id}">Delete</button>
            <div id="deletePostPlaceholder" class="d-none alert alert-danger">Could not delete post, please try again later</div>
            </div>
            </div>
            </a>
            </div>
          </div>
`;
    });
    // Update the HTML content with the generated listings
    placeholderProfileListings.innerHTML = listOfHtmlListings.join(" ");
// Add event listeners to the delete buttons for each listing
    const deleteBtns = document.querySelectorAll("#deleteBtn");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", event => {
            event.preventDefault();
            const listingId = btn.getAttribute("data-listingId");
            // Delete the listing and update the view accordingly
            deleteListing(listingId).then(successfulDeletedListing => {
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


/**
 * Fetches all listings associated with the user's profile and renders them in the view.
 * Categorizes listings into active and ended based on their end date.
 */
function loadAndRenderListings() {
    // Fetch all listings associated with the user's profile
    getAllListingsByProfile(nameOfUser).then(listingsByUser => {
        // Store all listings, ended listings, and active listings
        allListings = listingsByUser;
        endedListings = listingsByUser.filter(listing => {
            return new Date(listing.endsAt) < new Date()
        })
        activeListings = listingsByUser.filter(listing => {
            return new Date(listing.endsAt) >= new Date()
        })
        // Render all listings in the view
        renderListings(allListings);
    })
}

loadAndRenderListings();

const allListingsBtn = document.querySelector("#allListings");
const activeListingsBtn = document.querySelector("#activeListings");
const endedListingsBtn = document.querySelector("#endedListings");

/**
 * Event listener function for the button that displays all listings.
 * Renders all listings in the view, updates button styles to indicate the active category.
 *
 * @param {Event} event - The click event triggering the function.
 */
allListingsBtn.addEventListener("click", event => {
    // Render all listings in the view
    renderListings(allListings);
    // Update button styles to indicate the active category
    allListingsBtn.classList.add("text-decoration-underline");
    activeListingsBtn.classList.remove("text-decoration-underline");
    endedListingsBtn.classList.remove("text-decoration-underline");
});
/**
 * Event listener function for the button that displays active listings.
 * Renders active listings in the view, updates button styles to indicate the active category.
 *
 * @param {Event} event - The click event triggering the function.
 */
activeListingsBtn.addEventListener("click", event => {
    // Render active listings in the view
    renderListings(activeListings);
    // Update button styles to indicate the active category
    allListingsBtn.classList.remove("text-decoration-underline");
    activeListingsBtn.classList.add("text-decoration-underline");
    endedListingsBtn.classList.remove("text-decoration-underline");
});

/**
 * Event listener function for the button that displays ended listings.
 * Renders ended listings in the view, updates button styles to indicate the active category.
 *
 * @param {Event} event - The click event triggering the function.
 */
endedListingsBtn.addEventListener("click", event => {
    // Render ended listings in the view
    renderListings(endedListings);
    // Update button styles to indicate the active category
    allListingsBtn.classList.remove("text-decoration-underline");
    activeListingsBtn.classList.remove("text-decoration-underline");
    endedListingsBtn.classList.add("text-decoration-underline");
});
