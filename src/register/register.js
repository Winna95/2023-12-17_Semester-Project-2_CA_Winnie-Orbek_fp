import { logInUser, registerNewUser } from "../js/authentication-api.js";


const registerForm = document.querySelector("#registerForm");

/**
 * Event listener for the registration form submission.
 *
 * This function handles the submission of the registration form, validates user input,
 * registers a new user, and logs them in if registration is successful.
 *
 * @param {Event} event - The event object representing the form submission.
 */
registerForm.addEventListener("submit", event => {
    event.stopPropagation();
    event.preventDefault();
    if(registerForm.checkValidity()) {
        const nameInput = document.querySelector("#nameInput").value;
        const emailInput = document.querySelector("#emailInput").value;
        const passwordInput = document.querySelector("#passwordInput").value;
        const avatarImgInput = document.querySelector("#avatarUrlInput").value;
        registerNewUser(nameInput, emailInput, passwordInput, avatarImgInput).then(registrationErrors => {
            if(registrationErrors.length === 0) {
                logInUser(emailInput, passwordInput).then(successfulLogin => {
                    if(successfulLogin) {
                        window.location = "../profilePage/profilePage.html"
                    } else {
                        window.location = "/"
                    }
                }).catch(error => {

                    window.location = "/"
                    console.error(error);
                });
            } else {
                const concatenatedErrors = registrationErrors.join(", ");
                const registrationError = document.querySelector("#registrationError");
                registrationError.innerHTML = concatenatedErrors;
                registrationError.classList.remove("d-none");
                setTimeout(() => {
                    registrationError.classList.add("d-none");
                }, 3000);
            }
        }).catch(error => {
            const registrationError = document.querySelector("#registrationError");
            registrationError.innerHTML = "Unable to register user, please try again later";
            registrationError.classList.remove("d-none");
            console.error(error);

        });
    } else {
        registerForm.classList.add('was-validated');
    }
})
