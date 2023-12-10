import { logInUser } from "/src/js/authentication-api.js"

const forms = document.querySelectorAll('.needs-validation')

/**
 * Attach submit event listeners to forms and handle form submission.
 * Validates the form inputs, attempts user login, and redirects to the profile page on successful login.
 * Displays an error message if login fails.
 *
 * @param {Event} event - The submit event triggering the function.
 */
Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()
        // Check if the form is valid
        if (form.checkValidity()) {
            // Get email and password inputs
            const emailInput = document.querySelector("#emailInput").value;
            const passwordInput = document.querySelector("#passwordInput").value;
            // Attempt user login
            logInUser(emailInput, passwordInput).then(sucessfulLogin => {
                if(sucessfulLogin === true) {
                    // Redirect to the profile page on successful login
                    window.location = "/src/profilePage/profilePage.html"
                } else {
                    // Display error message and reset form validation
                    form.classList.remove('was-validated');
                    document.querySelector("#loginError").classList.remove("d-none");
                }
            })
            // Hide error message after a delay
            setTimeout(() => {
                document.querySelector("#loginError").classList.add("d-none");
            }, 3000);

        } else {
            // Add 'was-validated' class to display validation errors
            form.classList.add('was-validated')
        }

    }, false)
})






