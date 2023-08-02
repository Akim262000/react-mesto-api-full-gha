export const base_url = 'https://auth.nomoreparties.co';

const checkResponse = (response) => {
  return response.ok
    ? response.json()
    : Promise.reject(
        new Error(`Ошибка ${response.status}: ${response.statusText}`)
      );
};

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const register = ({ email, password }) => {
  return fetch(`${base_url}/signup`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  }).then((res) => checkResponse(res));
};

export const authorize = ({ email, password }) => {
  return fetch(`${base_url}/signin`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
  }).then((res) => checkResponse(res));
};

export const getContent = (token) => {
  return fetch(`${base_url}/users/me`, {
    method: 'GET',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkResponse(res));
};
