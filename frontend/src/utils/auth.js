//const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://api.vashinkognito.nomoredomainsrocks.ru';

function getResponseData(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

// отправляем запрос на роут идентификации
export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => getResponseData(res));
};

// отправляем запрос на роут аутентификации
export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((res) => getResponseData(res));
};

// проверка достоверности токена на сервере
export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => getResponseData(res))
    .then((data) => {
      return data;
    });
};
