const baseUrl = 'https://api.noroff.dev/api/v1';

export async function registerNewUser(name, email, password, avatarImgUrl) {
  if (!name) {
    throw new Error('Name is required to register a new user');
  }
  if (!email) {
    throw new Error('Email is required to register a new user');
  }
  if (!password) {
    throw new Error('Password is required to register a new user');
  }

  const requestBody = {
    name: name,
    email: email,
    password: password,
    avatar: avatarImgUrl,
  };
  const url = baseUrl + '/auction/auth/register';
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  };
  try {
    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      return data.errors.map(error => error.message);
    }
    return [];
  } catch (error) {
    console.error(error);
  }
}

export async function logInUser(email, password) {
  if (!email) {
    throw new Error('Email is required to register a new user');
  }
  if (!password) {
    throw new Error('Password is required to register a new user');
  }

  const requestBody = {
    email: email,
    password: password,
  };
  const url = baseUrl + '/auction/auth/login';
  const fetchOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  };
  const response = await fetch(url, fetchOptions);

  const data = await response.json();

  if (
    (data.statusCode && data.statusCode !== 200) ||
    (data.errors && data.errors.length > 0)
  ) {
    return false;
  }

  const jwt = data.accessToken;
  localStorage.setItem('jwt', jwt);
  localStorage.setItem('name', data.name);
  return true;
}
