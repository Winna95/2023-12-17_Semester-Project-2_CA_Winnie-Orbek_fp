const baseUrl = "https://api.noroff.dev/api/v1";

/**
 * Registers a new user with name, email, password and profile image url.
 *
 * @param {string} name - The name of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user.
 * @param {string} avatarImgUrl - The URL of the user's profile image.
 * @throws {Error} If any of the required parameters (name, email, or password) is missing.
 * @returns {Promise<Array<string>>} An array of error messages if registration fails; otherwise, an empty array.
 */
export async function registerNewUser (name, email, password, avatarImgUrl) {
    if(!name) {
        throw new Error("Name is required to register a new user");
    }
    if(!email) {
        throw new Error("Email is required to register a new user");
    }
    if(!password) {
        throw new Error("Password is required to register a new user");
    }

    const requestBody = {
        name: name,
        email: email,
        password: password,
        avatar: avatarImgUrl
    };
    const url = baseUrl + "/social/auth/register";
    const fetchOptions = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody)
    }
    try {
        const response = await fetch(url, fetchOptions);

        const data = await response.json();

        if(data.errors && data.errors.length > 0) {
            return data.errors.map(error => error.message);
        }
        return [];
    } catch(error) {
        console.error(error);
    }


}

/**
 * Logs in a user with email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @throws {Error} If either the email or password is missing.
 * @returns {Promise<boolean>} `true` if login is successful, `false` otherwise.
 */
export async function logInUser (email, password) {
    if(!email) {
        throw new Error("Email is required to register a new user");
    }
    if(!password) {
        throw new Error("Password is required to register a new user");
    }

    const requestBody = {
        email: email,
        password: password
    };
    const url = baseUrl + "/social/auth/login";
    const fetchOptions = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody)
    }
    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if((data.statusCode && data.statusCode !== 200) || (data.errors && data.errors.length > 0)) {
        return false;
    }

    const jwt = data.accessToken;
    localStorage.setItem("jwt", jwt);
    localStorage.setItem("name", data.name);
    return true;
}