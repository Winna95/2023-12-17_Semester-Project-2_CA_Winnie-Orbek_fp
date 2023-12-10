export function isAuthenticated() {
  return !!localStorage.getItem('jwt');
}

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
      window.location.href = '/src/sellProductPage/sellProduct.html';
    });
  }
}

export function addClickListenerForLogOut() {
  const logoutBtn = document.querySelector('#logoutBtn');
  //to handle when a user is not logged in
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('jwt');
      localStorage.removeItem('name');
      window.location.href = '/src/login/login.html';
    });
  }
}
