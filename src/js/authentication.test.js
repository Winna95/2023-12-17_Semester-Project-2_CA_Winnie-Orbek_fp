import { when } from 'jest-when';
import { isAuthenticated, logOut } from './authentication.js';

describe('Authentication', () => {
  it('returns false when checking if a user is authenticated when a jwt is not present in local storage', () => {
    global.localStorage = {
      getItem: jest.fn(),
    };
    when(global.localStorage.getItem).calledWith('jwt').mockReturnValue(null);
    const returnValue = isAuthenticated();
    expect(returnValue).toBeFalsy();
  });
  it('returns true when checking if a user is authenticated when a jwt is present in local storage', () => {
    global.localStorage = {
      getItem: jest.fn(),
    };
    when(global.localStorage.getItem)
      .calledWith('jwt')
      .mockReturnValue('fake jwt');

    const returnValue = isAuthenticated();

    expect(returnValue).toBeTruthy();
  });
  it('Logs out a user by removing jwt from locale storage and changing url', () => {
    global.localStorage = {
      removeItem: jest.fn(),
    };
    global.window = {
      location: {
        href: null,
      },
    };
    logOut();
    expect(global.localStorage.removeItem).toHaveBeenCalledWith('jwt');
    expect(global.localStorage.removeItem).toHaveBeenCalledWith('name');
    expect(global.localStorage.removeItem).toHaveBeenCalledTimes(2);
    expect(global.window.location.href).toEqual('../login/login.html');
  });
});
