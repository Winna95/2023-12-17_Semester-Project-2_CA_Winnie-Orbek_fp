/**
 * Checks if a user is authenticated based on the presence of a JWT token in the local storage.
 *
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
export function isAuthenticated() {
  return !!localStorage.getItem('jwt');
}

/**
 * Adjusts the visibility of menu items in the header based on the user's authentication status.
 * If the user is authenticated, the logged-in menu items are displayed, and the not-logged-in menu items are hidden.
 */
export function headerForLoggedInOrLoggedOutUser() {
  if (isAuthenticated()) {
    const loggedInMenuItems = document.querySelector('#loggedInMenuItems');
    const notLoggedInMenuItems = document.querySelector(
      '#notLoggedInMenuItems',
    );
    loggedInMenuItems.classList.remove('d-none');
    notLoggedInMenuItems.classList.add('d-none');
  }
}

/**
 * Handles the click event on the "Sell" button. If the user is not authenticated,
 * it displays an overlay indicating that the user needs to log in.
 * If the user is authenticated, it redirects to the sell product page.
 */
export function overlayClickingOnSellForNotLoggedInUser() {
  const sellBtn = document.querySelector('#sellBtn');
  if (!isAuthenticated()) {
    sellBtn.addEventListener('click', () => {
      const overlaySellButton = document.querySelector('#overlay-sell-button');
      overlaySellButton.classList.remove('d-none');
      setTimeout(() => {
        overlaySellButton.classList.add('d-none');
      }, 5500);
    });
  } else {
    sellBtn.addEventListener('click', () => {
      window.location.href = '../sellProductPage/sellProduct.html';
    });
  }
}

export function logOut() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('name');
  window.location.href = '../login/login.html';
}

/**
 * Adds a click event listener to the logout button. When clicked, it removes
 * the user's authentication information from local storage and redirects to
 * the login page.
 */
export function addClickListenerForLogOut() {
  const logoutBtn = document.querySelector('#logoutBtn');
  //to handle when a user is not logged in
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => logOut());
  }
}
