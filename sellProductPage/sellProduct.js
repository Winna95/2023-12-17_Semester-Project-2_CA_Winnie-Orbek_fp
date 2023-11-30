import {createListing} from "../js/listings-api.js";

const sellProductForm = document.querySelector("#sellProductForm");

sellProductForm.addEventListener("submit", event => {
    event.stopPropagation();
    event.preventDefault();
    if(sellProductForm.checkValidity()) {
        const titleInput = document.querySelector("#titleInput").value;
        const endsAtInput = document.querySelector("#endsAtInput").value;
        const tagsInput = document.querySelector("#tagsInput").value;
        const mediaUrlInput = document.querySelector("#mediaUrlInput").value;
        const descriptionInput = document.querySelector("#descriptionInput").value;
        createListing(
            titleInput,
            endsAtInput,
            tagsInput.split(",").map(tag => tag.trim()),
            descriptionInput,
            mediaUrlInput.split(",").map(mediaUrl => mediaUrl.trim())
        ).then(creationErrors => {
            if(creationErrors.length === 0) {
                alert ("A new listing for your product was sucessfully created");
                window.location.href = "../index.html"
            } else {
                const concatenatedErrors = creationErrors.join(", ");
                const creationErrorPlaceholder = document.querySelector("#creationErrorPlaceholder");
                creationErrorPlaceholder.innerHTML = concatenatedErrors;
                creationErrorPlaceholder.classList.remove("d-none");
                setTimeout(() => {
                    creationErrorPlaceholder.classList.add("d-none");
                }, 3000);
            }
        }).catch(error => {
            const creationErrorPlaceholder = document.querySelector("#creationErrorPlaceholder");
            creationErrorPlaceholder.innerHTML = "Unable to create a listing for your product, please try again later";
            creationErrorPlaceholder.classList.remove("d-none");
            console.error(error);

        });
    } else {
        sellProductForm.classList.add('was-validated');
    }
})