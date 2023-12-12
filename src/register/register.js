import { logInUser, registerNewUser } from "../js/authentication-api.js";
import {overlayClickingOnSellForNotLoggedInUser} from "../js/authentication.js";

overlayClickingOnSellForNotLoggedInUser(false)


const registerForm = document.querySelector("#registerForm");

/**
 * Attach a submit event listener to the registration form and handle form submission.
 * Validates the form inputs, registers a new user, and logs in the user on successful registration.
 * Displays registration errors or redirects to the profile page after successful login.
 *
 * @param {Event} event - The submit event triggering the function.
 */
registerForm.addEventListener("submit", event => {
    event.stopPropagation();
    event.preventDefault();
    // Check if the form is valid
    if(registerForm.checkValidity()) {
        // Get input values
        const nameInput = document.querySelector("#nameInput").value;
        const emailInput = document.querySelector("#emailInput").value;
        const passwordInput = document.querySelector("#passwordInput").value;
        const avatarImgInput = document.querySelector("#avatarUrlInput").value;
        // Register a new user and handle registration errors
        registerNewUser(nameInput, emailInput, passwordInput, avatarImgInput).then(registrationErrors => {
            if(registrationErrors.length === 0) {
                // Log in the user on successful registration
                logInUser(emailInput, passwordInput).then(successfulLogin => {
                    if(successfulLogin) {
                        // Redirect to the profile page on successful login
                        window.location = "../profilePage/profilePage.html"
                    } else {
                        // Redirect to the login page on login failure
                        window.location = "../login/login.html"
                    }
                }).catch(error => {
                    // Redirect to the login page and log error on login failure
                    window.location = "../login/login.html"
                    console.error(error);
                });
            } else {
                // Display registration errors and hide the message after a delay
                const concatenatedErrors = registrationErrors.join(", ");
                const registrationError = document.querySelector("#registrationError");
                registrationError.innerHTML = concatenatedErrors;
                registrationError.classList.remove("d-none");
                setTimeout(() => {
                    registrationError.classList.add("d-none");
                }, 3000);
            }
        }).catch(error => {
            // Display a generic registration error and log the error
            const registrationError = document.querySelector("#registrationError");
            registrationError.innerHTML = "Unable to register user, please try again later";
            registrationError.classList.remove("d-none");
            console.error(error);

        });
    } else {
        // Add 'was-validated' class to display validation errors
        registerForm.classList.add('was-validated');
    }
})
