import {createListing} from "/src/js/listings-api.js";
import {addClickListenerForLogOut} from "/src/js/authentication.js";
addClickListenerForLogOut()

const sellProductForm = document.querySelector("#sellProductForm");

/**
 * Attach a submit event listener to the sell product form and handle form submission.
 * Validates the form inputs, creates a new listing for the product,
 * and displays success or error messages accordingly.
 *
 * @param {Event} event - The submit event triggering the function.
 */
sellProductForm.addEventListener("submit", event => {
    event.stopPropagation();
    event.preventDefault();

    // Check if the form is valid
    if(sellProductForm.checkValidity()) {
        // Get input values
        const titleInput = document.querySelector("#titleInput").value;
        const endsAtInput = document.querySelector("#endsAtInput").value;
        const tagsInput = document.querySelector("#tagsInput").value;
        const mediaUrlInput = document.querySelector("#mediaUrlInput").value;
        const descriptionInput = document.querySelector("#descriptionInput").value;
        // Create a new listing for the product and handle creation errors
        createListing(
            titleInput,
            endsAtInput,
            tagsInput.split(",").map(tag => tag.trim()),
            descriptionInput,
            mediaUrlInput.split(",").map(mediaUrl => mediaUrl.trim())
        ).then(creationErrors => {
            if(creationErrors.length === 0) {
                // Display success message and redirect to the profile page
                alert ("A new listing for your product was sucessfully created");
                window.location.href = "/src/profilePage/profilePage.html"
            } else {
                // Display creation errors and hide the message after a delay
                const concatenatedErrors = creationErrors.join(", ");
                const creationErrorPlaceholder = document.querySelector("#creationErrorPlaceholder");
                creationErrorPlaceholder.innerHTML = concatenatedErrors;
                creationErrorPlaceholder.classList.remove("d-none");
                setTimeout(() => {
                    creationErrorPlaceholder.classList.add("d-none");
                }, 3000);
            }
        }).catch(error => {
            // Display a generic creation error and log the error
            const creationErrorPlaceholder = document.querySelector("#creationErrorPlaceholder");
            creationErrorPlaceholder.innerHTML = "Unable to create a listing for your product, please try again later";
            creationErrorPlaceholder.classList.remove("d-none");
            console.error(error);

        });
    } else {
        // Add 'was-validated' class to display validation errors
        sellProductForm.classList.add('was-validated');
    }
})