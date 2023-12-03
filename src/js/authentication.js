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
  if (!isAuthenticated()) {
    const sellBtn = document.querySelector('#sellBtn');
    sellBtn.addEventListener('click', () => {
      const overlaySellButton = document.querySelector('#overlay-sell-button');
      overlaySellButton.classList.remove('d-none');
      setTimeout(() => {
        overlaySellButton.classList.add('d-none');
      }, 5500);
    });
  }
}
